const dependencies = require('./package.json');

const sharedDependenciesLazy = {};

for(const dep in dependencies.dependencies)
{
    const version = dependencies.dependencies[dep];

    sharedDependenciesLazy[dep] =
    {
        singleton: true,
        requiredVersion: version,
        version: version,
    };
}

sharedDependenciesLazy['app-config'] =
{
    singleton: true,
    requiredVersion: '1.0.0',
    version: '1.0.0',
};

sharedDependenciesLazy['shared-stuff'] =
{
    singleton: true,
    requiredVersion: '1.0.0',
    version: '1.0.0',
};

exports.sharedDependenciesLazy = sharedDependenciesLazy;