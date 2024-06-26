const Category = require("../models/Category");
const catchAsync = require("../utils/catchAsync");


// Create Category
exports.createCategory = catchAsync( async(req, res) => {
    const newCategory = await Category.create(req.body);
    if (!newCategory) return res.sendStatus(400);

    res.status(201).json({
        status: 'success',
        room : newCategory
    })
})

// Get All Category
exports.getAllCategory = catchAsync( async(req, res) => {
    const allCategory = await Category.find();

    if (!allCategory || allCategory.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'No Category found'
        });
    }

    res.status(200).json({
        status : 'success',
        results: allCategory.length,
        bookings : allCategory
    })
})

// Update Category
exports.updateCategory = catchAsync( async(req, res) => {

    const findCategory = await Category.findById(req.params.id);

    if (!findCategory) {
        return res.status(404).json({
            status: 'fail',
            message: 'Category not found'
        });
    }

    const updatedCategory = await Category.findByIdAndUpdate(findCategory._id , req.body, {
        new : true,
        runValidators : true
    });

    if (!updatedCategory) {
        return res.status(404).json({
            status: 'fail',
            message: 'Category not found or could not be updated'
        });
    }

    res.status(200).json({
        status : 'success',
        category : updatedCategory
    })
})

// Delete Category
exports.removeCategory = catchAsync( async(req, res) => {
    if (!req.params.id) return res.status(404).send('Id params not found');
    
    const deleteCategory = await Category.findByIdAndDelete(req.params.id)

    if (!deleteCategory) {
        return res.status(404).json({
            status: 'fail',
            message: 'Category not found'
        });
    }

    res.sendStatus(204);
})