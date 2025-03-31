module.exports = function (serverless) {
  if (serverless.variables.options.offline) return 'localhost'
  return { 'Fn::ImportValue': `RDSCluster-host-${process.env.STAGE}` }
};
