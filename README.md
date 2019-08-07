# BeCheckin-Scan

### How to build our app

#### Front-end
    In the root of the project, you should:
1. Install [node](https://nodejs.org/es/)
2. Next, run ```npm install```
3. And so, ```npm install -g ionic cordova```
4. At last, ```ionic serve```

### How to update the translations
    Translations are empty by default
1. Execute ```npm run extract-translations```
2. Check json files in 'src/assets/i18n/'
3. Write your translations

### Deploy
    The app will be build in "platform/browser/www" folder.
1. ```ionic cordova build browser --prod```
    
### Add plugin
1. ```ionic cordova plugin add ./[Nombre_plugin]```

## Aplicación para recepcionistas
### Cómo construir nuestra aplicación

#### Front-end
    En la carpeta raiz del proyecto, deberías:
1. Instalar [node](https://nodejs.org/es/)
2. Luego, ejecutar ```npm install```
3. Lo siguiente, ```npm install -g ionic cordova```
4. Por último, ```ionic serve```

### Cómo actualizar campos de traducción
    Las traducciones se generan por defecto vacías.
1. Ejecutar ```npm run extract-translations```
2. Repasar los ficheros generados en la carpeta 'src/assets/i18n/'
3. Escribir las nuevas traducciones

### Despliegue
    Se construirá en la carpeta "platform/browser/www"
1. ```ionic cordova build browser --prod```

### Añadir plugin
1. ```ionic cordova plugin add ./[Nombre_plugin]```