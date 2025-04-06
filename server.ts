import app from "./src/app";
import { productionConfig } from "./src/config/production";

const PORT = process.env.NODE_ENV === 'production' 
  ? Number(productionConfig.server.port) 
  : parseInt(process.env.PORT || '5000', 10);

const HOST = process.env.NODE_ENV === 'production'
  ? productionConfig.server.host
  : 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
