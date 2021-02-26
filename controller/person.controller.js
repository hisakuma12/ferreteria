const ErrorHandler = require("../util/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Person = require("../models/Person");

//Create Person => api/admin/person/new
exports.createPerson = catchAsyncErrors(async (req, res, next) => {
  const person = await Person.create(req.body);

  res.status(200).json({
    success: true,
    person,
  });
});

//Details Person => api/admin/person/:findById
exports.detailsPerson = catchAsyncErrors(async (req, res, next) => {
  const person = await Person.findById(req.params.id);

  if (!person) {
    return next(
      new ErrorHandler(`Person does not found this id: ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    person,
  });
});

//Delete Person => api/admin/person/:id
exports.updatePerson = catchAsyncErrors(async (req, res, next) => {
  let person = await Person.findById(req.params.id);

  if (!person) {
    return next(
      new ErrorHandler(`Person does not found this id: ${req.params.id}`, 400)
    );
  }

  person = await Person.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    person,
  });
});

//Delete Person => api/admin/person/:id
exports.deletePerson = catchAsyncErrors(async (req, res, next) => {
  const person = await Person.findById(req.params.id);

  if (!person) {
    return next(
      new ErrorHandler(`Person does not found this id: ${req.params.id}`, 400)
    );
  }

  await person.delete();
  res.status(200).json({
    success: true,
  });
});
