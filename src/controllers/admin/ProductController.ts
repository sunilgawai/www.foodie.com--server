import { NextFunction, Request, Response } from "express";
import Validate from "../../validators";
import { CustomErrorHandler } from "../../services";
import { Category, Product } from "../../models";
import { IFile } from "../../typings";
import fs from "fs";
import { appRoot } from "../../Server";

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

    const { images } = req.files as unknown as { image: IFile[], images: IFile[] }

    // Needs to validate following code later.
    // let product_image: string = image[0].path;
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
      // image: product_image,
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
      products = await Product.find()
        .select('-__v -createdAt -updatedAt')
        .populate('category')

      if (!products) {
        return next(CustomErrorHandler.notFound("Products not available."))
      }
    } catch (error) {
      return next(error);
    }

    res.status(200).json({ products });
  }

  public async update(req: Request, res: Response, next: NextFunction) {
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

    // Check for category.
    try {
      let _category = await Category.findById({ _id: category });

      if (!_category) {
        return next(CustomErrorHandler.notFound("Category Not Found. Please create it first!"));
      }

    } catch (error) {
      return next(error);
    }

    // Check if images are present or not.
    let product_images: string[] = [];
    if (req.files) {
      const { images } = req.files as unknown as { image: IFile[], images: IFile[] }

      // Needs to validate following code later.
      // let product_image: string = image[0].path;

      images.forEach((file) => {
        product_images.push(file.path);
      })
    }

    let results;
    try {
      results = await Product.findByIdAndUpdate({ _id: req.params._id }, {
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
        // image: product_image,
        ...(product_images.length && { images: product_images })
      }, { new: true })
    } catch (error) {
      return next(error);
    }

    if (!results) {
      return next(CustomErrorHandler.notFound("Product not found."));
    }

    return res.status(200).json({ results })
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    let results;
    try {
      results = await Product.findByIdAndDelete({ _id: req.params._id });
      console.log('result after delet', results)
      if (!results) {
        return next(CustomErrorHandler.notFound("Product not found."))
      }

      // Delete all the images from storage.
      if (results) {
        console.log('img path', results)
        results.images.forEach(async (curr, idx) => {
          console.log('img path', curr)
          fs.unlink(`${appRoot}/curr`, (err) => {
            return next(err);
          })
        })
      }
    } catch (error) {
      return next(error);
    }
    console.log(results);
    return res.status(200).json({ results })
  }
}

export default new ProductController();