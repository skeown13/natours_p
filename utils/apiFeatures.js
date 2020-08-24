class APIFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter() {
    const queryObj = { ...this.queryString }
    console.log(queryObj)
    const excludedFields = ["page", "sort", "limit", "fields"]
    excludedFields.forEach(el => delete queryObj[el])

    // In the real world we would then need to write documentation about which requests can be made using which https methods and also what kind of filtering/sorting/etc are available and how they can be used.
    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    )

    this.query = this.query.find(JSON.parse(queryString))

    return this
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ")
      this.query = this.query.sort(sortBy)
      // sort("price ratingsAverage")
    } else {
      this.query = this.query.sort("-createdAt")
    }
    return this
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ")
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select("-__v")
    }

    return this
  }

  paginate() {
    // page=3&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 100
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}

module.exports = APIFeatures
