@app
fly-1cs

@static

@http
get /api

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
