# Heuristica Application, version 1.0-SNAPSHOT, deployed on Kubernetes
# Access the application at [http://6ddqc27pvg.lb.c1.gra7.k8s.ovh.net/](http://6ddqc27pvg.lb.c1.gra7.k8s.ovh.net/)
Heuristica is a Rest API and a web view for testing geometric algorithms and NP-complete problems on a random distribution points.
The version 1.0-SNAPSHOT provide only our implementation of:
- The minimum covering circle and its diameter
- Convex envelope
- Traveling Salesman Problem resolved by 2-Opt(In Review)
- Multiple Traveling Salesman Problem with budged resolved by TSP and fixed charges in sectors taking 2π/n of minimum covering circle(In Review)

## To compile api code as native executable and run local api server and and local client web server 
- Install [Docker](https://docs.docker.com/install/)
- In file, `docker-compose.yml` replace ports specs by your docker host padding `<Docker host>:port:port` if it's different of `localhost`
- In root folder, Run containers for native api server and web server with:
```
docker-compose up
```

## To deploy production environment on Kubernetes and CI/CD pipeline with Jenkins

- Create a Kubernetes Cluster at your cloud provider, and get a `kubeconfig` file
- Make sure you have installed locally [Kubectl](https://kubernetes.io/fr/docs/tasks/tools/install-kubectl/) and store `kubeconfig` file
- Connect a docker registry to a cluster to host applications
```
kubectl create secret docker-registry regcred --docker-server="<DOCEKR_REGISTRY>" --docker-username="<DOCEKR_USERNAME>" --docker-password="<DOCEKR_PASSWORD>" --docker-email="<DOCEKR_EMAIL>"
```
- Make sure you have installed [Helm](https://helm.sh/docs/intro/install/) on your Kubernetes cluster with Kubectl
- Create a Kubernetes deployment of Jenkins named `kissing-giraffe-jenkins`  with helm:
```
helm install --name kissing-giraffe-jenkins --set master.servicetype=NodePort stable/jenkins
```
- Then follow:
- Get your 'admin' user password by running:
```
printf $(kubectl get secret --namespace default kissing-giraffe-jenkins -o jsonpath="{.data.jenkins-admin-password}" | base64 --decode);echo
```
- Get the Jenkins URL to visit by running these commands in the same shell:
      NOTE: It may take a few minutes for the LoadBalancer IP to be available.
            You can watch the status of by running `kubectl get svc --namespace default -w kissing-giraffe-jenkins`
 ```
export SERVICE_IP=$(kubectl get svc --namespace default kissing-giraffe-jenkins --template "{{ range (index .status.loadBalancer.ingress 0) }}{{ . }}{{ end }}")
echo http://$SERVICE_IP:8080/login
```
- Login with the password from step 1 and the username: `admin`
- Save all needed environment variables for Jenkinsfile
    - Jenkins environment variables: `K8s_SERVER_URL`, `K8s_CONTEXT_NAME`, `K8s_CLUSTER_NAME`, `DOCKER_REGISTRY` and `DOCKER_REPOSITORY`
    - Jenkins credentials and their Ids as environment variables: `DOCKER_CREDENTIALS_ID` and provide `K8s_CREDENTIALS_ID`
- Set image of Docker and Kubectl as Jenkins agent in Kubernetes Pod template configuration
- In `k8s/jenkins` folder, Run `/init-jenkins.sh` to authorize Jenkins to create Kubernetes Object
- Run pipeline with Jenkinsfile

