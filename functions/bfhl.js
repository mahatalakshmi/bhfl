const dotenv = require('dotenv')
const Pipedrive = require('pipedrive')

const defaultClient = Pipedrive.ApiClient.instance;
let apiToken = defaultClient.authentications.api_key;
apiToken.apiKey = process.env.PIPEDRIVE_API_KEY;

exports.handler = async function (event, context) {
    const { firstName, lastName, email, phone } = JSON.parse(event.body)

    try {
        const personApi = new Pipedrive.PersonsApi();
        let personOpts = Pipedrive.NewPerson.constructFromObject({
            name: firstName + ' ' + lastName,
            phone: [{ "value": phone, "primary": "true", "label": "main" }],
            email: [{ "value": email, "primary": "true", "label": "mobile" }]
        });
        const { data } = await personApi.addPerson(personOpts)
        const person = data
        const leadsApi = new Pipedrive.LeadsApi();
        let leadsOpts = Pipedrive.AddLeadRequest.constructFromObject({
            title: `${person.name}'s lead`,
            personId: person.id,
        });
        const record = await leadsApi.addLead(leadsOpts)
        return {
            statusCode: 201,
            body: JSON.stringify(record)
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Server Error',
        };
    }



};
