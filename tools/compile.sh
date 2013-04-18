#!/bin/bash

export INDEX=../dist/index.html
export TEMP=../dist/temp.txt

rm -r ../dist/*

touch $TEMP
echo "" > $TEMP
cat ../templates/auth/login.html >> $TEMP
cat ../templates/forms/updateInstance.html >> $TEMP
cat ../templates/forms/createFlavor.html >> $TEMP
cat ../templates/forms/updateImage.html >> $TEMP
cat ../templates/forms/rebootInstances.html >> $TEMP
cat ../templates/forms/changePassword.html >> $TEMP
cat ../templates/forms/createKeyPair.html >> $TEMP
cat ../templates/forms/createSnapshot.html >> $TEMP
cat ../templates/forms/createVolumeSnapshot.html >> $TEMP
cat ../templates/forms/createVolume.html >> $TEMP
cat ../templates/forms/editVolumeAttachments.html >> $TEMP
cat ../templates/forms/launchImage.html >> $TEMP
cat ../templates/forms/createContainer.html >> $TEMP
cat ../templates/forms/uploadObject.html >> $TEMP
cat ../templates/forms/launchVDC.html >> $TEMP
cat ../templates/forms/createVDCService.html >> $TEMP
cat ../templates/root/nova/overview.html >> $TEMP
cat ../templates/root/nova/accessAndSecurity.html >> $TEMP
cat ../templates/root/nova/snapshots.html >> $TEMP
cat ../templates/root/nova/snapshots/instanceSnapshots.html >> $TEMP
cat ../templates/root/nova/snapshots/volumeSnapshots.html >> $TEMP
cat ../templates/root/nova/instancesAndVolumes/instances.html >> $TEMP
cat ../templates/root/nova/instancesAndVolumes/volumes.html >> $TEMP
cat ../templates/root/nova/instanceDetail.html >> $TEMP
cat ../templates/root/nova/imageDetail.html >> $TEMP
cat ../templates/root/nova/volumeDetail.html >> $TEMP
cat ../templates/root/nova/VDCs.html >> $TEMP
cat ../templates/root/nova/VDC.html >> $TEMP
cat ../templates/root/nova/VDCService.html >> $TEMP
cat ../templates/root/objectstorage/containers.html >> $TEMP
cat ../templates/root/objectstorage/container.html >> $TEMP
cat ../templates/root/sys/images.html >> $TEMP
cat ../templates/root/sys/overview.html >> $TEMP
cat ../templates/root/sys/instances.html >> $TEMP
cat ../templates/root/sys/services.html >> $TEMP
cat ../templates/root/sys/flavors.html >> $TEMP
cat ../templates/root/sys/projects.html >> $TEMP
cat ../templates/root/sys/users.html >> $TEMP
cat ../templates/root/sys/quotas.html >> $TEMP
cat ../templates/root/root.html >> $TEMP
cat ../templates/root/navTab.html >> $TEMP
cat ../templates/root/topBar.html >> $TEMP
cat ../templates/root/sideBar.html >> $TEMP
cat ../templates/root/confirm.html >> $TEMP
cat ../templates/root/settings.html >> $TEMP
cat ../templates/messages.html >> $TEMP

cat ../index.temp.head.html > $INDEX
#cat $TEMP >> $INDEX
cat ../index.temp.foot.html >> $INDEX

java -jar compiler.jar  --js ../js/os-utils.js \
                        --js_output_file ../dist/libs.js
java -jar compiler.jar  --js ../js/models/*.js \
                        --js_output_file ../dist/models.js
java -jar compiler.jar  --js ../js/views/*/*.js \
                        --js ../js/views/*.js \
                        --js_output_file ../dist/views.js
java -jar compiler.jar  --js ../js/routes/* \
                        --js_output_file ../dist/routes.js
                        
#cat ../lib/underscore.js > ../dist/libs.js
#cat ../lib/backbone.js >> ../dist/libs.js
#cat ../lib/jstack.js >> ../dist/libs.js
#cat ../lib/bootstrap.min.js >> ../dist/libs.js
#cat ../lib/jquery.selectbox-0.1.3.min.js >> ../dist/libs.js
#cat ../js/os-utils.js > ../dist/libs.js
#cat ../js/models/*.js > ../dist/models.js
#cat ../js/views/*/*.js > ../dist/views.js
#cat ../js/views/*.js >> ../dist/views.js
#cat ../js/routes/*.js > ../dist/routes.js

cp -r ../css ../dist/
cp -r ../locales ../dist/
cp -r ../fonts ../dist/
cp -r ../images ../dist/
cp -r ../templates ../dist/