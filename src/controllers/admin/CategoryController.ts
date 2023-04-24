import { NextFunction, Request, Response } from "express";
import { CustomErrorHandler } from "../../services";
import Validate, { AdminValidation } from "../../validators";
import { Category } from "../../models";

class CategoryController {
    public async store(req: Request, res: Response, next: NextFunction) {
        // Validate the request.
        const { error } = AdminValidation.post_category(req.body);
        if (error) {
            return next(error);
        }
        const { name, isActive } = req.body;
        const icon = req.file;
        console.log({body: req.body, file: req.file})
        // Check is category is already exists.
        let category_exists;
        try {
            category_exists = await Category.findOne({
                name: req.body.name
            });
            if (category_exists) {
                return next(CustomErrorHandler.alreadyExists("Category already Exists."));
            }
        } catch (error) {
            return next(error);
        }

        // Create category.
        const category = new Category({
            name: req.body.name,
            isActive: req.body.isActive,
            icon: req.body.icon
        })

        // Save the category.
        let _category;
        try {
            _category = await category.save();
            if (!_category) {
                return next(CustomErrorHandler.serverError());
            }
        } catch (error) {
            return next(error);
        }
        // send the request.
        res.status(200).json({ category: _category })
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        // const category = req.body.category;
        let _categories;
        try {
            _categories = await Category.find();
            if (!_categories) {
                return next(CustomErrorHandler.notFound("Categories not found."));
            }
        } catch (error) {
            return next(error);
        }

        res.status(200).json({ categories: _categories })
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        const { _id, name, isActive, icon } = req.body;
        console.log(req.body);
        try {
            const result = await Category.findByIdAndUpdate({ _id }, {
                name: name,
                isActive: isActive,
                icon: icon
            })
            if (!result) {
                return next(CustomErrorHandler.serverError());
            }
        } catch (error) {
            return next(error);
        }

        res.status(200).json({
            status: "ok",
            message: "Category updated succesfully."
        })
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const _id = req.body._id;
        try {
            const result = await Category.findByIdAndDelete({ _id });
            if (!result) {
                return next(CustomErrorHandler.serverError());
            }
        } catch (error) {
            return next(error);
        }

        res.status(200).json({
            status: "ok",
            message: "Category deleted succesfully"
        })
    }
}

export default new CategoryController();