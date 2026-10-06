# Tech logos

Logos de tecnologías usados en casos de éxito y secciones de stack tecnológico.

## Archivos

La mayoría provienen de la sección "Technologies We Use" de [Devox Software](https://devoxsoftware.com/expertise/outsource-web-development/).

### Front End
- `nextjs.svg` / `nextjs.png`
- `react.png`, `vue.png`, `angular.png`, `svelte.png`
- `typescript.svg`, `javascript.png`
- `pwa.png`, `html-css.png`, `opencv.png`
- `tailwind-css.svg`, `motion.svg`

### Back End
- `nestjs.svg`, `flask.png`, `django.png`, `express-js.png`
- `dot-net.png`, `php.png`, `ruby.png`, `java-spring.png`, `python.png`
- `c-plusplus.png`

### DevOps & Cloud
- `conan.png`, `cmake.png`, `github-actions.png`
- `cuda.png`, `datadog.png`, `grafana.png`
- `kubernetes.png`, `podman.png`, `docker.png`, `google-cloud.png`

### Database
- `mariadb.png`, `redis.png`, `cassandra.png`, `mongodb.png`
- `oracle-db.png`, `sql-server.png`, `postgresql.svg`
- `elasticsearch.png`, `mysql.png`

### Web 3
- `evm.png`, `arbitrum.png`, `nownodes.png`, `web3-js.png`
- `hardhat.png`, `ethers-js.png`, `openzeppelin.png`
- `chainlink.png`, `truffle.png`, `moralis.png`
- `blockchain.svg`

### AI / ML
- `dl4j.png`, `chainer.png`, `cntk.png`, `caffe.png`, `theano.png`

## Mapeo

El mapeo nombre → ruta está en `src/lib/tech-logos.ts` (`TECH_LOGO_MAP`). Si una tecnología no tiene logo, se muestra solo el texto.

## Descargar logos desde Devox

```bash
node scripts/download-tech-logos.js
```
