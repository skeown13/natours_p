exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id)

  if (!tour) {
    return next(new AppError("No tour found with that ID", 404))
  }

  // status code 204 is "no content"
  res.status(204).json({
    status: "success",
    data: null,
  })
})
