import { NextFunction, Request, Response } from "express";
import { CustomErrorHandler } from "../../services";
import { AdminValidation } from "../../validators";
import { Category } from "../../models";
import fs from "fs";
import { APP_PORT } from "../../../config";

class CategoryController {
    public async store(req: Request, res: Response, next: NextFunction) {
        // Validate the request.
        console.log(req.files);
        console.log(req.body)
        const { error } = AdminValidation.post_category(req.body);
        if (error) {
            return next(error);
        }
        const { name, isActive } = req.body;
        const icon = req.file;
        if(!icon) {
            return next(CustomErrorHandler.notFound("Icon not found. Please ensure you have sent an icon."))
        }
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
            icon: icon.path
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
        const { name, isActive } = req.body;
        console.log(req.body);
        try {
            const result = await Category.findByIdAndUpdate({ _id: req.params._id }, {
                name: name,
                isActive: isActive
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
        let results;
        try {
            results = await Category.findByIdAndDelete({ _id: req.params._id });
            if (!results) {
                return next(CustomErrorHandler.serverError());
            }
            
            // Needs to delete image from disk/public as we deleting category.
            // try {
            //     console.log('path', results.icon)
            //     fs.unlinkSync(`${results.icon}`);
            // } catch (error) {
            //     return next(error);
            // }
        } catch (error) {
            return next(error);
        }

        res.status(200).json({
            status: "ok",
            message: `Category ${results.name} is deleted succesfully`
        })
    }
}

export default new CategoryController();