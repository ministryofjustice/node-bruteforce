## Bringing the power of NodeJS to web form bruteforcing...

Configured for Rails Devise and Django Admin interface but supports custom configuration for other variations. Option to set the maximum number of concurrent requests to prevent overloading the target server.

Please use responsibly!

### Setup

```shell
  $ git clone git@github.com:foxjerem/node-bruteforce.git
  $ cd node-bruteforce
  $ chmod 755 run.js
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

    $ ./run.js -u root -w words.txt -N 50-t http://localhost:8000/admin/login -T django
    $ ./run.js -u admin@rails.com -w words.txt -N 35 -t http://localhost:3000/users/sign_in -T rails
    $ ./run.js -u root -w words.txt-t http://dvwa/login -c config/dvwa.json

```


