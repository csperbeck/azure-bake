const bump = require('gulp-bump');
const exec = require('child_process').exec;
const del = require('del');
const es = require('event-stream');
const fs = require('file-system');
const git = require('gulp-git');
const gulp = require('gulp');
const debug = require('gulp-debug');
const inlinesource = require('gulp-inline-source');
const moment = require('moment');
const shell = require('gulp-shell');

//Parameters and Variables
const params = require('./build/parameters');

function build(done) {
    if (!params.isRunningOnADO) { gulp.series(lernaBuild)(done); }
    else if ( params.conditions.isRunningOnADO ) {
        if ( !!params.build.pullRequestID ) {
            return gulp.series( printVersion, adoPrep, toolInstall, lernaBuild )(done);
        } 
        else if ( !params.build.pullRequestID && params.build.buildSourceBranch.match(/master/i) ) {
            return gulp.series( printVersion, adoPrep, toolInstall, lernaBuild, lernaPublish, systemPublish )(done);
        }
    }
    else { done('Build did not complete!'); }
}

function bumpVersion() {
    return gulp.src(['ingredient/**/package.json'], { base: './' })
        .pipe(bump({ type: 'patch' }))
        .pipe(gulp.dest('./'));
}

function cleanCoverage() {
    return del('coverage/**', { force: true });
}

function adoPrep(done) {
    var branchName = params.buildSourceBranch;
    if (branchName !== 'master') {
        // all branches have refs/heads/ - we don't need that
        // we will also remove feature/ if it's there
        branchName = branchName.replace(/refs\/heads\/(feature\/)?/i, '');
    }
    
    var gitScript = `sudo git checkout ${branchName}`;
    console.log('ADO Prep Script: ' + gitScript);
    return runCmd(gitScript, done);    
}

function toolInstall(done) {
    var branchName = params.build.buildSourceBranch;
    if (branchName !== 'master') {
        // all branches have refs/heads/ - we don't need that
        // we will also remove feature/ if it's there
        branchName = branchName.replace(/refs\/heads\/(feature\/)?/i, '');
    }
    
    var gitScript = `sudo npm install lerna@3.13.0 typescript@3.3.3 --global` ;
    console.log('Tool Script: ' + gitScript);
    return runCmd(gitScript, done);    
}

function lernaBuild(done) {
    var branchName = params.build.buildSourceBranch;
    console.log(branchName);
    if (branchName !== 'master') {
        // all branches have refs/heads/ - we don't need that
        // we will also remove feature/ if it's there
        branchName = branchName.replace(/refs\/heads\/(feature\/)?/i, '');
    }
    
    var gitScript = `sudo npm run clean:build` ;
    console.log('Build Script: ' + gitScript);
    return runCmd(gitScript, done);    
}

function lernaBuild(done) {
    var branchName = params.build.buildSourceBranch;
    if (branchName !== 'master') {
        // all branches have refs/heads/ - we don't need that
        // we will also remove feature/ if it's there
        branchName = branchName.replace(/refs\/heads\/(feature\/)?/i, '');
    }
    
    var gitScript = `npm run clean:build` ;
    console.log('Build Script: ' + gitScript);
    return runCmd(gitScript, done);    
}

function lernaPublish(done) {
    var branchName = params.build.buildSourceBranch;
    if (branchName !== 'master') {
        // all branches have refs/heads/ - we don't need that
        // we will also remove feature/ if it's there
        branchName = branchName.replace(/refs\/heads\/(feature\/)?/i, '');
    }
    
    var gitScript = `sudo npm run publish` ;
    console.log('Build Script: ' + gitScript);
    return runCmd(gitScript, done);    
}

function systemPublish(done) {
    var branchName = params.build.buildSourceBranch;
    if (branchName !== 'master') {
        // all branches have refs/heads/ - we don't need that
        // we will also remove feature/ if it's there
        branchName = branchName.replace(/refs\/heads\/(feature\/)?/i, '');
    }
    
    var gitScript = `sudo npm run release-build --prefix ./system` ;
    console.log('Build Script: ' + gitScript);
    return runCmd(gitScript, done);    
}

function inlineCoverageSource() {
    return gulp.src('./coverage/*.html')
        .pipe(inlinesource({ attribute: false }))
        .pipe(gulp.dest('./coverage/inline-html'));
}

function printVersion(done) {
    let name = require('./package.json').version;

    if (process.env.BUILD_REASON === 'PullRequest') {
        // pull requests will be [version]_[source branch name]
        const branchName = process.env.SYSTEM_PULLREQUEST_SOURCEBRANCH;
        name += '_' + branchName.replace(/refs\/heads\/(feature\/)?/i, '');
    } else if (process.env.BUILD_SOURCEBRANCHNAME) {
        const branchName = process.env.BUILD_SOURCEBRANCH;

        if (branchName !== 'master') {
            // all branches have refs/heads/ - we don't need that
            // we will also remove feature/ if it's there
            name += '_' + branchName.replace(/refs\/heads\/(feature\/)?/i, '');
        }
    }

    // make sure no illegal characters are there
    name = name.replace(/\"|\/|:|<|>|\\|\|\?|\@|\*/g, '_');

    // add YYYYMMDD_HHmm to mark the date and time of this build
    name += `_${moment().format('YYYYMMDD.HHmm')}`;

    console.log('##vso[build.updatebuildnumber]' + name);
    done();
}

function runCmd (command, done) {
    var child = exec(command);
    child.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });
    child.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    child.on('error', function (errors) {
        console.log('Comand Errors: ' + errors);
        done(errors);
    });
    child.on('close', function (code) {
        console.log('closing code: ' + code);
        done(null, code);
    });
    
}
function setupCoveragePool() {
    return gulp.src(["ingredinent/**/src/*.ts", "system/**/src/*.ts", "core/src/*.ts"]).pipe(writeFilenameToFile()).pipe(debug());
}

function sonarQube(done) {
	if (!parms.isRunningOnADO) {
		console.log('Skipping SonarQube analysis for local build...');
		done();
	}
	else {
		let version = require('./package.json').version;
		//standard SonarQube configuration options
		let sonarOptions = {
			"sonar.projectName": "Azure-Bake",
			"sonar.projectKey": "azure-bake",
			"sonar.typescript.lcov.reportPaths": "coverage/lcov.info",
			"sonar.projectVersion": version,
			//"sonar.cpd.exclusions": "src/index.html, dist/index.html",
			"sonar.coverage.exclusions": "**/*.spec.ts, gulpfile.js, karma.conf.js, protractor.conf.js, **/node_modules/*"
		};

		//get source branch name
		let sourceBranch = (process.env.BUILD_REASON === 'PullRequest') ? process.env.SYSTEM_PULLREQUEST_SOURCEBRANCH : process.env.BUILD_SOURCEBRANCH;
		sourceBranch = sourceBranch.replace(/refs\/heads\//i, '');

		//if running from a pull request, add the target branch option
		if (process.env.BUILD_REASON === 'PullRequest') {
			sonarOptions["sonar.branch.target"] = process.env.SYSTEM_PULLREQUEST_TARGETBRANCH.replace(/refs\/heads\//i, '');
		}

		//if not running on the master branch, add the source branch option
		if (sourceBranch != 'master') {
			sonarOptions["sonar.branch.name"] = sourceBranch
		}

		sonarqubeScanner({
			serverUrl: "https://sonarqube.hchb.com",
			token: argv.sonarToken,
			options: sonarOptions
		}, done);
	}
}

function testNycMocha(done) {
    return shell.task(['nyc mocha --opts test/mocha.opts'])(done());
}

function writeFilenameToFile() {
    let output = fs.createWriteStream(__dirname + '/test/app.spec.ts');
    output.write('// I am an automatically generated file. I help ensure that unit tests have accurate code coverage numbers. You can ignore me.\n\n')
    //Return event-stream map to the pipeline
    return es.map((file, cb) => {
        let name = file.history[0];
        if (name) {
            name = name.replace(__dirname + '.').replace(/\\/g, '/');
            output.write('require(\'' + name + '\');\n');
        }
        //Callback signals the operation is done and returns the object to the pipeline
        cb(null, file);
    });
}

//Tasks
exports.build = build;
exports.prep = adoPrep;
exports.analysis = gulp.series(sonarQube);
exports.bump = bumpVersion;
exports.cleancoverage = cleanCoverage;
exports.coverage = gulp.series(cleanCoverage, setupCoveragePool, testNycMocha);
exports.coveragesonarqube = gulp.series(cleanCoverage, setupCoveragePool, testNycMocha, sonarQube);
exports.inlinecoveragesource = inlineCoverageSource;
exports.pretest = gulp.series(cleanCoverage, setupCoveragePool);
exports.printversion = printVersion;
exports.setupcoveragepool = setupCoveragePool;
exports.testnycmocha = testNycMocha;