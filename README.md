## Functionality

Simple bruteforce scripts for web applications utilizing node concurrency! Last parameters allows us to set the maximum number of concurrent requests to prevent overloading the server.

### Django Admin Interface

```shell
  $ npm install
  $ chmod 755 scripts/djangoAdmin.js
  $ ./scripts/djangoAdmin.js

    NodeJS Django Admin Login Bruteforce 1.0
    Usage: ./djangoAdmin.js <username> <wordlist> <target url> <max concurrent requests>
  
  $ ./scripts/djangoAdmin.js root words.txt http://localhost:8000/admin 50
```

### Rails Devise Sign In

```shell
  $ npm install
  $ chmod 755 scripts/djangoAdmin.js
  $ ./scripts/railsDevise.js
    
    NodeJS Rails Devise Login Bruteforce 1.0
    Usage: ./railsDevise.js <username> <wordlist> <target url> <max concurrent requests>

  $ ./scripts/railsDevise.js admin@rails.com words.txt http://localhost:3000/users/sign_in 50
```
