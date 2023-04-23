import { NextFunction, Request, Response } from "express";
import Validate from "../../validators";
import { CustomErrorHandler } from "../../services";
import { Category, Product } from "../../models";
import { IFile } from "../../typings";

class ProductController {

  public async create(req: Request, res: Response, next: NextFunction) {
    // Validate the request.
    const { error } = Validate.admin_product_request(req.body);
    if (error) {
      return next(error);
    }

    const {
      name, price, size, description, details,
      isActive, isFeatured, category, countInStock,
      ratings, descount, wishlist
    } = req.body;
    console.log(req.files)

    // Check if the provided category is available and active.
    // Needs to delete this one functionality 
    // as we will provide available category at front end.
    // _id: "643af08285f70980c0f4098d"
    try {
      let _category = await Category.findById({ _id: category });

      if (!_category) {
        return next(CustomErrorHandler.notFound("Category Not Found. Please create it first!"));
      }

    } catch (error) {
      return next(error);
    }

    // Check if images are present or not.
    if (!req.files) {
      return next(CustomErrorHandler.fileNotFound("Images not found. Please provide images."));
    }

    const { image, images } = req.files as unknown as { image: IFile[], images: IFile[] }

    // Needs to validate following code later.
    let product_image: string = image[0].path;
    let product_images: string[] = [];

    images.forEach((file) => {
      product_images.push(file.path);
    })

    // Create the product.
    const product = new Product({
      name,
      price,
      size,
      category,
      description,
      details,
      isFeatured,
      ratings,
      isActive,
      descount,
      wishlist,
      countInStock,
      image: product_image,
      images: product_images
    })

    // Save the product in DataBase.
    let results;
    try {
      // Saving in DataBase.
      results = await product.save();
      if (!results) {
        return next(CustomErrorHandler.serverError());
      }
    } catch (error) {
      return next(error);
    }

    return res.status(200).json({ results })
  }

  public async get(req: Request, res: Response, next: NextFunction) {
    let products;
    try {
      products = await Product.find().populate('category');
      if (!products) {
        return next(CustomErrorHandler.notFound("Products not available."))
      }
    } catch (error) {
      return next(error);
    }

    res.status(200).json({ products });
  }

  public async update(req: Request, res: Response, next: NextFunction) { }

  public async delete(req: Request, res: Response, next: NextFunction) { }
}

export default new ProductController();