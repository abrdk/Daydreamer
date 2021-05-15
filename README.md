### Daydreamer

Put ideas on a timeline. [Start now!](https://daydreamer.app)

<p align="center">
    <a href="https://daydreamer.app">
        <img src="https://i.ibb.co/qNTQ5hg/daydreamer-v04-example.png" width="600"/>
    </a>
</p>

Run the following commands to start the app:

```bash
git clone https://github.com/abrdk/Daydreamer
cd Daydreamer
mkdir -p /tmp/Daydreamer
docker-compose up
```

The service should be available at [http://localhost](http://localhost).

Several options are available for configuration in the `.env` file:

```bash
# DAYDREAMER_DATA - MongoDB data storage path. Specify non-tmp directory for permanent storage; don't forget to create it, e.g 'mkdir -p /opt/Daydreamer'
DAYDREAMER_DATA=/opt/Daydreamer

# The container is configured to support https connection if accessed via domain name.
# Specify domain name in the BASE_DNS_NAME if you plan to use https.
# ACME_EMAIL is email address for notifications.
BASE_DNS_NAME=daydreamer.app
ACME_EMAIL=andrew.brdk@gmail.com
```

To run the app without Docker, install dependencies (`yarn install`) and [specify MongoDB path](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/) in `MONGO_URI` environment variable. `yarn dev` starts the app in the development mode.

The UI specification is available at [Figma](https://www.figma.com/file/5TvJ1XE0h5pL2uUu1inhYv/DayDreamer_v0.4_new_UI?node-id=150%3A1876).

### Version History
v0.5 (mobile web)  
&nbsp;&nbsp;&nbsp; Design - [Vitaliy Kravchuk](https://freelancehunt.com/freelancer/DemonStrike.html)  
&nbsp;&nbsp;&nbsp; Programming - [Maxim Pozdnyakov](https://freelancehunt.com/freelancer/maxim_pozdnyakow.html)  
[v0.4](https://github.com/abrdk/Daydreamer/tree/749fcbc55e16513457730d14763f5e2959583f61) (new UI)  
&nbsp;&nbsp;&nbsp; Design - [Vitaliy Kravchuk](https://freelancehunt.com/freelancer/DemonStrike.html)  
&nbsp;&nbsp;&nbsp; Programming - [Maxim Pozdnyakov](https://freelancehunt.com/freelancer/maxim_pozdnyakow.html)  
&nbsp;&nbsp;&nbsp; Docker configuration - [Aleksey Shepelev](https://freelance.habr.com/freelancers/AlekseyShepelev)  
[v0.3](https://github.com/abrdk/Daydreamer/tree/v0.3_backend)  
&nbsp;&nbsp;&nbsp; Design - [Ilya Steki](https://www.fl.ru/users/stekivac/portfolio/)  
&nbsp;&nbsp;&nbsp; Programming - [Vitaliy Surikov](https://www.fl.ru/users/zizizi-ru/portfolio/)  
[v0.2 (as Dreamcatcher)](https://github.com/abrdk/Daydreamer/tree/v0.2)  
&nbsp;&nbsp;&nbsp; Programming - Andrew  
[v0.1 (as GanttBox)](https://github.com/abrdk/ganttbox)  
&nbsp;&nbsp;&nbsp; Programming - [Fedor Tukmakov](https://freelance.habr.com/freelancers/impfromliga)  
[v0.01 (as Unholy Mess)](https://github.com/noooway/unholy_mess)  
&nbsp;&nbsp;&nbsp; Programming - Andrew
