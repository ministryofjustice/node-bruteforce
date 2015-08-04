## Bringing the power of NodeJS to web form bruteforcing...

[![Code Climate](https://codeclimate.com/github/foxjerem/node-bruteforce/badges/gpa.svg)](https://codeclimate.com/github/foxjerem/node-bruteforce)

Configured for Rails Devise and Django Admin interface but supports custom configuration for other variations. Option to set the maximum number of concurrent requests to prevent overloading the target server.

Please use responsibly!

### Setup

```shell
  $ git clone git@github.com:foxjerem/node-bruteforce.git
  $ cd node-bruteforce
  $ chmod 755 run.js
  $ npm install -g
  $ node-bruteforce
```

### Usage

```shell

  Usage: node-bruteforce -u <username> -w <wordlist> -t <target> [options]

  NodeJS HTTP(S) Login Form Bruteforcer

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -u, --username <string>  login username
    -w, --wordlist <file>    dictionary file
    -t, --target <url>       target sign in url
    -N, --num-requests [n]   maximum concurrent requests (default 25)
    -T, --type [framework]   specify target framework
    -c, --config [file]      custom .json config file

  Examples:

    $ ./run.js -u root -w words.txt -N 50-t http://localhost:8000/admin -T django
    $ ./run.js -u admin@rails.com -w words.txt -N 35 -t http://localhost:3000/users/sign_in -T rails
    $ ./run.js -u root -w words.txt-t http://dvwa/login -c config/dvwa.json

```

### Custom Configuration

Rails Devise and Django Admin default login screens are supported by default through the -T flag. In case some settings have been modified or for applications with a similar set up, users can create a custom config file to use through the -c flag. See the [template](https://github.com/foxjerem/node-bruteforce/blob/master/config/custom/template.json) for a skeleton config to get started.

### Wordlists

A number of dependable wordlists can be found here:

+ [Linkedin 2012](http://www.adeptus-mechanicus.com/codex/hashpass/hashpass.php)
+ [RockYou](https://wiki.skullsecurity.org/Passwords)

