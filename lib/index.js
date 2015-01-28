/**
 * Sails.js Context Loader module
 *
 * this module load context data for use in ACL and controllers
 *
 * @todo change to be a sails.js npm hook in sails 0.11.x
 */

var actionUtil = require('we-helpers').actionUtil;
var _ = require('lodash');
var context = {};

context.sails = {};

/**
 * Sails.js context police
 */
context.sails.police = function sailsContextLoader(req, res, next) {
  // sails-context requires req.options.action
  if ( !req.options || !req.options.action ) {
    return next();
  }

  // set context object in request
  req.context = {};
  // point view context var to req.context
  res.locals.context = req.context;

  if (req.options.model) {
    req.context.Model = actionUtil.parseModel(req);
  }

  switch (req.options.action) {
    case 'find':
      return context.loadContextForRecords(req, res, next);
    case 'findOne':
    case 'update':
    case 'destroy':
      return context.loadContextForRecord(req, res, next);
    default:
      return next();
  }
};

/**
 * Load context for single record requests
 */
context.loadContextForRecord = function(req, res, next) {
  req.context.pk = actionUtil.requirePk(req);

  if( !_.isNumber(req.context.pk) )
    req.context.pk = null;

  req.context.isList = false;
  context.loadContextRecord(req, function(err) {
    if (err) {
      return res.serverError(err);
    }

    return next();
  })
}

/**
 * Load context for list requests
 */
context.loadContextForRecords = function(req, res, next) {
  req.context.where = actionUtil.parseCriteria(req);
  req.context.isList = true;
  context.loadListCount(req, function (err) {
    if (err) {
      sails.log.verbose(err);
      return next();
    }
    return next();
  })
}

/**
 * Preload current record for findOne, update and destroy
 */
context.loadContextRecord = function(req, cb) {
  if (!req.context.Model || !req.context.pk) {
    req._sails.log.verbose('sails-context: Model not found in context.loadContextRecord', req.options);
    req.context.record = null;
    return cb();
  }

  req.context.Model.findOneById(req.context.pk)
  .exec(function(err, record) {
    if (err) {
      req._sails.log.verbose('sails-context: Error on loadContextRecord', err);
      return cb();
    }

    if (_.isEmpty(record) ) {
      req.context.notFound = true;
    }

    req.context.record = record;

    return cb();
  });
}

/**
 * Load count for list requests
 */
context.loadListCount = function loadListCount(req, cb) {
  if (!req.context.Model) {
    req.context.records = null;
    return cb();
  }

  return req.context.Model.count(req.context.where)
  .exec(function afterGetModelCount(err, count) {
    if (err) {
      req._sails.log.verbose('sails-context: Error on loadListCount',err);
      return cb();
    }

    req.context.count = count;

    return cb();
  });
}

module.exports = context;
