## Functionality

Simple bruteforce scripts for web applications utilizing node concurrency! 

Configured for Rails Devise and Django Admin interface but supports custom configuration for other variations. Option to set the maximum number of concurrent requests to prevent overloading the target server.

Please use responsibly

```shell

  Usage: run [options]

  NodeJS HTTP(S) Login Form Bruteforcer

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -u, --username          login username
    -w, --wordlist          dictionary file
    -t, --target            target sign in url
    -N, --num-requests      maximum concurrent requests
    -T, --type <framework>  specify target framework (rails|django)
    -c, --config            custom .json config file

  Examples:

    $ ./run.js -u root -w words.txt -t http://localhost:8000/admin/login -N 50 -T django
    $ ./run.js -u admin@rails.com -w words.txt -t http://localhost:3000/users/sign_in -N 50 -T rails

```
