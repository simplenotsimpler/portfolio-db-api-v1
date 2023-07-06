# Archived

This project is no longer being maintained. Check out [Express proxy API backend](https://github.com/simplenotsimpler/sns-site-react-backend) which is the new back end for my SNS React site.

# Portfolio Database API

MongoDB Realm App API which serves portfolio data from a MongoDB Atlas database (free tier).

This is then called from [github-portfolio-simplified](https://github.com/simplenotsimpler/github-portfolio-simplified), a Node/Express app which combines this data with pinned GitHub repos and renders into my Portfolio website: http://simplenotsimpler.com.

## Notes

- Inital set up of the MongoDB Realm App was done in the Realm UI.
- This repo is used to push subsequent changes to the Realm App via a simple Continuous Deployment model.
- Code is in the http_endpoints/api folder.
- MongoDB aggregation is used to group and stack positions by company.

## Why use a Realm App?

- Portfolio data such as skills, education and work are stored in a MongoDB Atlas (free tier) database.
- MongoDB Atlas free tier only has the option to whitelist IPs.
- Allowing all IPs as suggested in the forums has security ramificatins.
- Minimizes security issues while maintaining free-tier hosting flexibility.

# License

This project is [MIT licensed](./LICENSE).
