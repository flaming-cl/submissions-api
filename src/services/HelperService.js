/**
 * Helper Service
 */

const errors = require('common-errors')

const ReviewTypeService = require('./ReviewTypeService')
const dbhelper = require('../common/dbhelper')

/**
 * Function to check references in the given entity
 * @param {Object} entity entity in which references need to be checked
 * @return {boolean} Returns true if all references are valid
 * @throws {Error} if any of the reference is invalid
 */
function * _checkRef (entity) {
  if (entity.typeId) {
    const existReviewType = yield ReviewTypeService._getReviewType(entity.typeId)

    if (!existReviewType) {
      throw new errors.HttpStatusError(400, `Review type with ID = ${entity.typeId} does not exist`)
    }
  }

  if (entity.submissionId) {
    const filter = {
      TableName: 'Submission',
      Key: {
        'id': entity.submissionId
      }
    }
    const existSubmission = yield dbhelper.getRecord(filter)
    if (!existSubmission.Item) {
      throw new errors.HttpStatusError(400, `Submission with ID = ${entity.submissionId} does not exist`)
    }
  }
}

module.exports = {
  _checkRef
}
