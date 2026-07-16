# AWS para QA (con una pincelada de Ansible)

Los entornos donde pruebas viven cada vez más en la nube. Un QA no necesita ser arquitecto de AWS, pero sí orientarse: saber **dónde están los logs, los datos y los artefactos**, y moverse por ellos sin depender de nadie.

## Los cinco servicios que un QA toca de verdad

| Servicio | Qué es | Para qué lo usa un QA |
|---|---|---|
| **EC2** | Máquinas virtuales | Ahí suelen correr los entornos de prueba (o el propio runner de CI) |
| **S3** | Almacenamiento de objetos | Reports de test, artefactos, datasets, evidencias |
| **RDS** | Bases de datos gestionadas | Conectarte para [validar datos con SQL](/es/api-testing/sql-for-qa) |
| **CloudWatch** | Logs y métricas | Diagnosticar *por qué* falló ese E2E: el error real está en el log del servicio |
| **IAM** | Identidades y permisos | Entender qué puedes tocar (y por qué no puedes tocar lo demás) |

## La CLI: lo justo para ser autónomo

```bash
# Descargar el report que dejó la pipeline
aws s3 cp s3://mi-bucket/reports/run-1234/ ./reports --recursive

# Seguir los logs de un servicio en directo (el "docker logs" de la nube)
aws logs tail /ecs/mi-servicio --follow --since 15m

# ¿Qué entornos hay levantados?
aws ec2 describe-instances --filters "Name=tag:env,Values=qa" \
  --query "Reservations[].Instances[].[InstanceId,State.Name]"
```

Con `aws s3` y `aws logs tail` se resuelve el 80 % del día a día de un QA en AWS.

## Ideas que conviene tener claras

- **Credenciales**: siempre temporales (SSO/roles) y nunca en el repo ni en el código de tests — la regla de [Git no olvida](/es/cicd/git-for-qa) aplica doble aquí.
- **Permisos mínimos**: si no puedes tocar producción, es a propósito. Pide el rol que necesitas, no la llave maestra.
- **Los entornos cuestan dinero**: una instancia levantada "para probar una cosa" y olvidada es la fuga clásica. Los entornos efímeros (se crean para la prueba, se destruyen después) son el patrón sano.
- **Regiones**: los recursos viven en una región concreta; "no encuentro el bucket" suele significar "estás mirando en la región equivocada".

## ¿Y Ansible?

**Ansible** es una herramienta de automatización de configuración: describe en YAML (*playbooks*) el estado deseado de las máquinas — qué paquetes, qué configuración, qué servicios — y lo aplica de forma **idempotente** (ejecutarlo dos veces no rompe nada). A un QA le interesa por una razón concreta: **los entornos de prueba suelen crearse con él**. Cuando un entorno "está raro", el playbook es la especificación de cómo debería estar — leerlo es la forma rápida de saber qué esperar de la máquina.

## Errores comunes

- **Pedir ayuda antes de mirar CloudWatch**: el motivo del fallo casi siempre está en el log del servicio, no en el output del test.
- **Dar por hecho que el entorno es igual que ayer**: en la nube los entornos se recrean; verifica versión y configuración antes de reportar un "bug" que es un despliegue a medias.
- **Credenciales personales compartidas o hardcodeadas** — no hay atajo que justifique esto.

::: tip Idea clave
En la nube, la autonomía de un QA se mide en dos preguntas: ¿sé llegar al log del servicio que falló? ¿sé llegar a los datos y artefactos de mi prueba? Con S3, CloudWatch y una conexión a RDS, la respuesta es sí.
:::

## Referencias

- [Documentación de la AWS CLI](https://docs.aws.amazon.com/cli/)
- [Documentación de Ansible](https://docs.ansible.com/)
