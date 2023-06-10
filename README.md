# ¡Bienvenido a chatApp! 😃

ChaApp es una aplicación sencilla de chat en tiempo real con amigos y/o compañeros de trabajo. Es dinamica e intuitiva, se tiene que registrar y/o iniciar sesión para poder inicial a utilizar el chat.

## Instalación

*Composer install*

Clonar el proyecto:
```PowerShell
$ git@github.com:nestorlls/ChatApp.git
```

o

```PowerShell
https://github.com/nestorlls/ChatApp.git
```

```PowerShell
$ cd ChatApp
```

dentro de la carpeta ChatApp econtrarás dos carpetas api y client.
-  **Carpeta api**

```
$ cd api
```

dentro de la carpeta ejecute el siguiente comando para installar las dependencias.
```
$ yarn install
```

**configurar variables de entorno**
la aplicación necesita algunas variables para poder funcionar y en el archivo .env.example de tiene como ejemplos
```
//.env.example
MONGO_URI=[YOUR_MONGO_URI]
JWT_SECRETE=[YOUR_JWT_SECRET]
CLIENT_URL=[YOUR_CLIENT_URL]
```
MONGO_URI = mongodb+srv://your_project_name:<"your_proyect_password ">@cluster0.kkzyfqh.mongodb.net/?retryWrites=true&w=majority
JWT_SECRETE: puede tipear letras en forma aleatorio que servirá como token
CLIENT_URL: es la dominio de lado de Frontend, ejemplo: http://localhost:5173

teniendo las variables e instaladas las dependencias, ya esta lista en lado del servidor.

- **Carpeta client** 

abra otro terminal y dirijase a la carpeta **client** ejecutando el comando:

```
$ cd client
```

se necesita instalar la dependencias para el lado del Frontend. Ejecute el comando:
```
$ yarn install
```

Ya esta listo para comenzar a chatear 😉

## Ejecución
- Lado del servidor: dentro de la carpeta api ejecute el comando:
```
$ node index.js
```

aparecerá el mensaje en el terminal que significa que el servidor se esta ejecutando en el puerto 3000.
```
➜ node .\index.js
Listening on http://localhost:3000
```
- Lado del cliente: dentro de la carpeta client ejecute el comando:
```
$ yarn dev
```
Aparecerá como sique abajo. Dirijase a su navegador gidite el http://localhost:5173/ y tendrá la pagina de login y/o registro: 
```
➜ yarn dev    
yarn run v1.22.19
$ vite

  VITE v4.3.9  ready in 3433 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
  ```
