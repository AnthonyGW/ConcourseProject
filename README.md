# Concourse Project
Testing CI with Concourse

### CI Jobs
- Backend Unit Testing
- Backend Merge Testing (with Develop)
- Create Backend Build
- Frontend Unit Testing
- Frontend Merge Testing (with Develop)

### Pipeline Plan
1. Use a single [repository](https://github.com/AnthonyGW/ConcourseProject.git) as the source for both Backend and Frontend code.
2. Cache node_modules folder from the Frontend testing environment and compare `package.json` to implement changes to the cache.
3. Detect changes to Backend and Frontend code separately. Tests only execute when the respective code base is updated.
4. Transpile Frontend and Compile Backend for production after testing and commit the changes to a dedicated repository.