## When sending data from a client to a server using a GET request, there are several ways to include the data:

### 1. Query Parameters: The most common method, where data is appended to the URL in key-value pairs.
```{{base_url}}/endpoint?key1=value1&key2=value2 ```

### 2. Path Parameters: Data is included directly in the URL path.
``` {{base_url}}/endpoint/value1/value2 ```

### 3. Headers: Although less common for GET requests, you can include data in HTTP headers.
``` JavaScript
axios.get('{{base_url}}/endpoint', {
    headers: {
        'Custom-Header': 'value'
    }
});
```

### 4. Cookies: Data can be sent via cookies, which are automatically included in the request headers.
JavaScript
```
document.cookie = "key=value";
```
Each method has its use cases depending on the nature of the data and the server’s requirements.
Query parameters are the most straightforward and widely used for GET requests.
If you have any specific requirements or need further assistance, feel free to ask!
