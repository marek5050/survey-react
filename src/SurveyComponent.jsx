import React from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import "./index.css";
import { json } from "./json";

function validateCountry(_, { data, errors, complete }) {
  const countryName = data["country"];
  if (!countryName) {
    complete();
    return;
  }
  fetch("https://surveyjs.io/api/CountriesExample?name=" + countryName)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const found = data.length > 0;
      if (!found) {
        errors["country"] = "Country is not found";
      }
      complete();
    });
}
function SurveyComponent() {
    const survey = new Model(json);
    survey.onComplete.add((sender, options) => {
        console.log(JSON.stringify(sender.data, null, 3));
        fetch('https://survey-app-9ho7x.ondigitalocean.app/api/data', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            country: 'Czechia',
            additional_details: 'None',
          })
        })

    });
    survey.onServerValidateQuestions.add(validateCountry);
    return (<Survey model={survey} />);
}

export default SurveyComponent;