exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.path === "/api/health" && event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        status: "OK", 
        timestamp: new Date().toISOString(),
        message: "DTTools API is working!"
      })
    };
  }

  if (event.path === "/api/auth/login" && event.httpMethod === "POST") {
    try {
      const { email, password } = JSON.parse(event.body || "{}");
      if (email === "dttools.app@gmail.com" && password === "Gulex0519!@") {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            user: { id: "1", email, name: "Admin DTTools" },
            message: "Login successful"
          })
        };
      } else {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: "Invalid credentials"
          })
        };
      }
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: "Invalid request body"
        })
      };
    }
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ 
      message: "API endpoint not found",
      path: event.path,
      method: event.httpMethod
    })
  };
};
