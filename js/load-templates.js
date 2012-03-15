function loadTemplates(urls) {
    for (var index in urls) {
        url = urls[index];
        $.ajax({
            url: url,
            asynx: false, // synchonous call in case code tries to use template before it's loaded
            success: function (response) {
                $('head').append(response);
            }
        });
    }
}

loadTemplates([
    'templates/notLoggedInTemplate.html',
    'templates/imagesTemplate.html',
    'templates/rootTemplate.html',
    'templates/navTabTemplate.html',
    'templates/topBarTemplate.html',
    'templates/sideBarTemplate.html',
    'templates/sysOverviewTemplate.html',
    'templates/instancesTemplate.html',
    'templates/servicesTemplate.html',
    'templates/flavorsTemplate.html',
    'templates/projectsTemplate.html',
    'templates/usersTemplate.html',
    'templates/quotasTemplate.html',
    'templates/novaOverviewTemplate.html',
    'templates/novaAccessAndSecurityTemplate.html',
    'templates/novaImagesAndSnapshotsTemplate.html',
    'templates/novaInstancesAndVolumesTemplate.html'
]);