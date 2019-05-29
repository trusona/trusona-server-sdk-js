set -e

DOWNLOAD_URL="https://bintray.com/jeremy-long/owasp/download_file?file_path=dependency-check-5.0.0-M2-release.zip"
ZIP=dependency-check.zip
REPORT_DIR=build/security-reports
PROJECT=trusona-server-sdk-js

_DEPCHECK=./dependency-check/bin/dependency-check.sh

install() {
  curl -L ${DOWNLOAD_URL} -o ${ZIP}
  unzip ${ZIP}
  rm ${ZIP}
}

[[ -f ${_DEPCHECK} ]] || install

mkdir -p ${REPORT_DIR}
${_DEPCHECK} --format HTML --suppression suppression.xml --failOnCVSS 0 --project ${PROJECT} --scan src node_modules --out ${REPORT_DIR}
