const fs = require("fs");
const path = require("path");
const { withDangerousMod } = require("@expo/config-plugins");

const MARKER = "SWIFT_STRICT_CONCURRENCY";

const INJECT = `
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['${MARKER}'] = 'minimal'
      # Belt-and-suspenders for Swift 6 toolchains that still enforce strict checks.
      config.build_settings['OTHER_SWIFT_FLAGS'] = '$(inherited) -Xfrontend -strict-concurrency=minimal'
      config.build_settings['SWIFT_VERSION'] = '5.9'
    end
  end
`;

/**
 * Xcode 16 / Swift 6 strict concurrency breaks expo-modules-core Swift until upstream fixes land.
 * @see https://github.com/expo/expo/issues/32378
 */
function patchPodfile(contents) {
  if (contents.includes(MARKER)) {
    return contents;
  }
  if (!contents.includes("post_install do |installer|")) {
    return `${contents}\npost_install do |installer|${INJECT}\nend\n`;
  }
  return contents.replace(
    /post_install do \|installer\|/,
    `post_install do |installer|${INJECT}`,
  );
}

module.exports = function withPodfileSwiftConcurrency(config) {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const iosRoot =
        config.modRequest.platformProjectRoot ??
        path.join(config.modRequest.projectRoot, "ios");
      const podfilePath = path.join(iosRoot, "Podfile");
      if (!fs.existsSync(podfilePath)) {
        return config;
      }
      const next = patchPodfile(fs.readFileSync(podfilePath, "utf8"));
      fs.writeFileSync(podfilePath, next);
      return config;
    },
  ]);
}
