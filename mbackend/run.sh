source .env

PATH_TO_DOCKER_COMPOSE_FILE="docker-compose-$NODE_ENV.yml"

# pnpm run delete:ci
# docker compose up --watch
echo ${PATH_TO_DOCKER_COMPOSE_FILE}

if [ "$IS_RESTART_NGINX" == "1" ]; then
    echo -e "\e[32m-------------- Restarting Nginx! --------------\e[0m";

    docker stop nginx
    docker rm nginx
    docker rmi nginx
    docker compose -f "${PATH_TO_DOCKER_COMPOSE_FILE}" build nginx
    docker compose -f "${PATH_TO_DOCKER_COMPOSE_FILE}" up nginx -d

    echo -e "\e[32m************** Finished restarting Nginx **************\e[0m";

    exit 0;
fi

if [ "$IS_MODE_FORCE" == 1 ]; then
    echo -e "\e[31m-------------- !!!!!!!!!!!!!!!!!! --------------\e[0m";
    echo -e "\e[31m-------------- !!!!!!!!!!!!!!!!!! --------------\e[0m";
    echo -e "\e[31m-------------- !!!!!!!!!!!!!!!!!! --------------\e[0m";
    echo -e "\e[31m-------------- !!!!!!!!!!!!!!!!!! --------------\e[0m";
    echo -e "\e[31m-------------- !!!!!!!!!!!!!!!!!! --------------\e[0m";
    echo -e "\e[31m-------------- !!!!!!!!!!!!!!!!!! --------------\e[0m";
    echo -e "\e[31m-------------- !!!!!!!!!!!!!!!!!! --------------\e[0m";
    echo -e "\e[31m--------------  START FORCE MODE --------------\e[0m";
    echo -e "\e[31m--------------  START FORCE MODE --------------\e[0m";
    echo -e "\e[31m--------------  START FORCE MODE --------------\e[0m";
    echo -e "\e[31m--------------  START FORCE MODE --------------\e[0m";
    echo -e "\e[31m--------------  START FORCE MODE --------------\e[0m";
    echo -e "\e[31m--------------  START FORCE MODE --------------\e[0m";
    echo -e "\e[31m--------------  START FORCE MODE --------------\e[0m";
    echo -e "\e[31m-------------- !!!!!!!!!!!!!!!!!! --------------\e[0m";
    echo -e "\e[31m-------------- !!!!!!!!!!!!!!!!!! --------------\e[0m";
    echo -e "\e[31m-------------- !!!!!!!!!!!!!!!!!! --------------\e[0m";
    echo -e "\e[31m-------------- !!!!!!!!!!!!!!!!!! --------------\e[0m";
    echo -e "\e[31m-------------- !!!!!!!!!!!!!!!!!! --------------\e[0m";
    echo -e "\e[31m-------------- !!!!!!!!!!!!!!!!!! --------------\e[0m";
    echo -e "\e[31m-------------- !!!!!!!!!!!!!!!!!! --------------\e[0m";

    echo "All containers will be restart, are you sure?! y/n"

    read answer

    if [[ "$answer" == "y" ]]; then
        echo -e "\e[32m-------------- Yes! --------------\e[0m";

        sleep 5;

        # stop
        docker stop pg_deshopbackend
        docker stop pg_admin_deshopbackend
        docker stop nginx
#        docker stop openvpn
        # remove container
        docker rm pg_deshopbackend
        docker rm pg_admin_deshopbackend
        docker rm nginx
#        docker rm openvpn
        # remove image
        docker rmi postgres:16.4
        docker rmi dpage/pgadmin4:8
        docker rmi nginx
#        docker rmi openvpn
        # build
        # todo: скрипты для генерации конфиг файлов openvpn (они уже есть)
        # docker run -v ./openvpn:/etc/openvpn --rm kylemanna/openvpn ovpn_genconfig -u udp://vpn.dessly.net
        # docker run -v ./openvpn:/etc/openvpn --rm -it kylemanna/openvpn ovpn_initpki
        docker compose -f "${PATH_TO_DOCKER_COMPOSE_FILE}" build pg_deshopbackend
        docker compose -f "${PATH_TO_DOCKER_COMPOSE_FILE}" build pg_admin_deshopbackend
        docker compose -f "${PATH_TO_DOCKER_COMPOSE_FILE}" build nginx
#        docker compose -f "${PATH_TO_DOCKER_COMPOSE_FILE}" build openvpn
        # up
        docker compose -f "${PATH_TO_DOCKER_COMPOSE_FILE}" up pg_deshopbackend -d
        docker compose -f "${PATH_TO_DOCKER_COMPOSE_FILE}" up pg_admin_deshopbackend -d
        docker compose -f "${PATH_TO_DOCKER_COMPOSE_FILE}" up nginx -d
#        docker compose -f "${PATH_TO_DOCKER_COMPOSE_FILE}" up openvpn -d
    elif [[ "$answer" == "n" ]]; then
        echo -e "\e[31m-------------- No! --------------\e[0m";

        exit 0;
    else
        echo -e "\e[31m-------------- Invalid input. Please answer y or n! --------------\e[0m";

        exit 1;
    fi
fi


if [ "$NODE_ENV" == "prod" ]; then
    echo -e "\e[32m-------------- Start running .sh script in $NODE_ENV mode --------------\e[0m";

    docker stop deshopbackend deshopfrontend
    docker rm deshopbackend deshopfrontend
    docker rmi deshop-deshopbackend deshop-deshopfrontend
    docker compose -f "${PATH_TO_DOCKER_COMPOSE_FILE}" build deshopfrontend deshopbackend;
    docker compose -f "${PATH_TO_DOCKER_COMPOSE_FILE}" up deshopfrontend deshopbackend -d;

    echo -e "\e[32m************** Finished running .sh script in $NODE_ENV mode **************\e[0m";
elif [ "$NODE_ENV" == "dev" ]; then
    echo -e "\e[32m-------------- Start running .sh script in $NODE_ENV mode --------------\e[0m";

    docker stop deshopbackend deshopfrontend
    docker rm deshopbackend deshopfrontend
    docker rmi deshop-deshopbackend deshop-deshopfrontend
    docker compose -f "${PATH_TO_DOCKER_COMPOSE_FILE}" build deshopfrontend deshopbackend;
    docker compose -f "${PATH_TO_DOCKER_COMPOSE_FILE}" up deshopfrontend deshopbackend --watch;

    echo -e "\e[32m************** Finished running .sh script in $NODE_ENV mode **************\e[0m";
else
    echo -e "\e[31m-------------- Unknown environment: $NODE_ENV --------------\e[0m"

    exit 1;
fi


