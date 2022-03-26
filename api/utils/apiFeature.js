class APIFeature {
  constructor(queryInstance, queryString) {
    this.queryInstance = queryInstance;
    this.queryString = queryString;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit; // previous-page * limit

    this.queryInstance = this.queryInstance.skip(skip).limit(limit);

    return this;
  }
}


module.exports = APIFeature;