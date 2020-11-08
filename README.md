### Daydreamer
Put your ideas on a timeline. [Start now!](https://daydreamer-demo.herokuapp.com)

<p align="center">
    <a href="https://daydreamer-demo.herokuapp.com">
        <img src="https://i.ibb.co/kMR1VMC/daydreamer-v03-backend.png" width="600"/>
    </a>
</p>

Docker version can be started with the following commands:
``` bash
git clone https://github.com/abrdk/Daydreamer
cd Daydreamer
git checkout docker
docker-compose up
```
Open [http://localhost:3000](http://localhost:3000) to see the app.


To run the app on localhost it is necessary to install dependencies (`yarn install`) 
and [have MongoDB listening on port 27017](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/).
After that `yarn dev` starts the app in the development mode.
The service should be available at [http://localhost:3000](http://localhost:3000).


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
Gantt chart functionality is inspired by [Frappe Gantt](https://github.com/frappe/gantt).
