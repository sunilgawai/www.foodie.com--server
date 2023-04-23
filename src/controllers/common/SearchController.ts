import { NextFunction, Request, Response } from "express";
import { CustomErrorHandler } from "../../services";
import { Category, Product } from "../../models";

class SearchController {
    static async get_product(req: Request, res: Response, next: NextFunction) {
        let products;
        try {
            products = await Product.find().populate('categories');
            if (!products) {
                return next(CustomErrorHandler.notFound("Products not available."))
            }
        } catch (error) {
            return next(error);
        }

        res.status(200).json({ products });
    }

    public async get_category(req: Request, res: Response, next: NextFunction) {
        let _categories;
        try {
            _categories = await Category.find();
            if (!_categories) {
                return next(CustomErrorHandler.notFound("Categories not available"));
            }
        } catch (error) {
            return next(error);
        }

        res.status(200).json({ categories: _categories })
    }
}

export default new SearchController();