import { Button, Container, Accordion, Col, Row, Card, ToggleButton, ToggleButtonGroup, Form } from "react-bootstrap"
import axios from 'axios'
import { useEffect, useState } from "react"
import step1Image from '../assets/number-icons/1.svg'
import step2Image from '../assets/number-icons/2.svg'




const URL = import.meta.env.VITE_API_URL

function Services() {

  
    const [meals, setMeals] = useState([])
    const [plans, setPlans] = useState([])
    const [selectedDietaryChoices, setSelectedDietaryChoices] = useState([])
    const [selectedDietPlan, setSelectedDietPlan] = useState(null)
    const [selectedMeals, setSelectedMeals] = useState([])
    const [selectedFrequency, setSelectedFrequency] = useState(0)
    const [selectedPeople, setSelectedPeople] = useState(0)
    const [activeAccordion, setActiveAccordion] = useState(null)
    const [activeStep, setActiveStep] = useState(0)
    const [pricePerMeal, setPricePerMeal] = useState(null)
    let frequency = parseInt(selectedFrequency)
    let numPeople = parseInt(selectedPeople)



    const getMeals = async() => {
      const mealAPI = await axios.get(`${URL}/meals`)
      console.log(mealAPI.data)
      setMeals(mealAPI.data)
    }

    useEffect(() => {
        getMeals()
    }, [])

    const getPlans = async() => {
      const planAPI = await axios.get(`${URL}/plans`)
      console.log(planAPI.data)
      setPlans(planAPI.data)
    }

    useEffect(() => {
      getPlans()
    },[])

    
////////////////////////////////////
// for styling number icons
    
    const highlightStep = (id) => {
      const steps = document.querySelectorAll('.number')
        steps.forEach((step, index) => {
          if (index === id) {
            step.classList.add('clicked')
          } else {
            step.classList.remove('clicked')
          }
        }) 
    }    
    
    const handleAccordionChange = (accordionKey) => {
      setActiveAccordion(accordionKey)
      setActiveStep(parseInt(accordionKey))
      highlightStep(parseInt(accordionKey))
    }


//////////////////////////////////////////////////

    const handleNextStep = () => {
      if (activeStep === 0) {
        if(selectedDietaryChoices.length === 0) {
          return
        }
      } else if (activeStep === 1) {
        if (selectedFrequency.length === 0) {
          return
        }
      } else if (activeStep === 2) {
        if (selectedMeals.length === 0) {
          return
        }
      } 
      setActiveStep((prevStep) => prevStep + 1)
      setActiveAccordion((prevAccordion) => (prevAccordion + 1).toString())
    }

//////////////////////////////////////////////////
/// filtering meal prices


    const handleDietPlanChange = (event) => {
      const selectedDietPlanId = event.target.value
      const selectedDietPlan = plans.find((plan) => plan.name === selectedDietPlanId)
      setSelectedDietPlan(selectedDietPlan)
      console.log(selectedDietPlan.pricePerMeal)
      return(selectedDietPlan.pricePerMeal)
    }
    
    useEffect(()=>{
      console.log('diet plan', selectedDietPlan)
      if (selectedDietPlan){
        setPricePerMeal(selectedDietPlan.pricePerMeal)
      }
    },[selectedDietPlan])

    useEffect(()=>{
      console.log(`price per meal`, pricePerMeal)
    },[pricePerMeal])

      const taxPercent = 1.10
      const totalMeals = frequency * numPeople
      const totalPrice = (totalMeals * pricePerMeal).toFixed(2)
      const totalPriceWithTax = (totalPrice * taxPercent).toFixed(2)

    const renderPricePerMeal = () => {
      if (selectedDietPlan) {
        return <p>Price per Meal: ${selectedDietPlan.pricePerMeal}</p>
      }
      return null
    }



//////////////////////////////////////////////////

    const handleFrequencyChange = (event) => {
      const value = event.target.getAttribute('data-value')
      setSelectedFrequency(value)
    }
    
    useEffect(() => {
      console.log(selectedFrequency)
    }, [selectedFrequency])


    const handleNumberOfPeople = (event) => {
      const value = event.target.getAttribute('data-value')
      setSelectedPeople(value)
    }

    useEffect(() => {
      console.log(selectedPeople)
    },[selectedPeople])


//////////////////////////////////////////////////


 

    return (
      <>
       <h1 className='pt-5 mt-5' style={{fontSize:`8vw`}}>Customize your plan!</h1>
        <div className="py-5 my-5 step-container">
          <img
            src={step1Image}
            className={`number ${activeStep === 0 ? "clicked" : ""}`}
            alt="1"
          />
          <img
            src={step2Image}
            className={`number ${activeStep === 1 ? "clicked" : ""}`}
            alt="2"
          />
        </div>

        <Container className="services-main">
          <Accordion
            defaultActiveKey="0"
            className="py-5"
            activeKey={activeAccordion}
            onSelect={handleAccordionChange}
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header>Choose your diet plan</Accordion.Header>
              <Accordion.Body>
                <ul className="diet-checklist">
                  <li className="dietary-choice">
                    <span>General Plan</span>
                    <input
                      type="radio"
                      id="diet-plan-1"
                      name="diet-plan"
                      value="General Plan"
                      checked={selectedDietPlan === "plan1"}
                      onChange={handleDietPlanChange}
                    />
                  </li>
                  <li className="dietary-choice">
                    <span>Vegetarian Plan</span>
                    <input
                      type="radio"
                      id="diet-plan-2"
                      name="diet-plan"
                      value="Vegetarian Plan"
                      checked={selectedDietPlan === "plan2"}
                      onChange={handleDietPlanChange}
                    />
                  </li>
                  <li className="dietary-choice">
                    <span>Pescatarian Plan</span>
                    <input
                      type="radio"
                      id="diet-plan-3"
                      name="diet-plan"
                      value="Pescatarian Plan"
                      checked={selectedDietPlan === "plan3"}
                      onChange={handleDietPlanChange}
                    />
                  </li>
                  <li className="dietary-choice">
                    <span>Vegan Plan</span>
                    <input
                      type="radio"
                      id="diet-plan-4"
                      name="diet-plan"
                      value="Vegan Plan"
                      checked={selectedDietPlan === "plan4"}
                      onChange={handleDietPlanChange}
                    />
                  </li>
                  <li className="dietary-choice">
                    <span>Halal Plan</span>
                    <input
                      type="radio"
                      id="diet-plan-5"
                      name="diet-plan"
                      value="Halal Plan"
                      checked={selectedDietPlan === "plan5"}
                      onChange={handleDietPlanChange}
                    />
                  </li>
                  <li className="dietary-choice">
                    <span>Kosher Plan</span>
                    <input
                      type="radio"
                      id="diet-plan-6"
                      name="diet-plan"
                      value="Kosher Plan"
                      checked={selectedDietPlan === "plan6"}
                      onChange={handleDietPlanChange}
                    />
                  </li>
                  <li className="dietary-choice">
                    <span>Gluten-Free Plan</span>
                    <input
                      type="radio"
                      id="diet-plan-7"
                      name="diet-plan"
                      value="Gluten-Free Plan"
                      checked={selectedDietPlan === "plan7"}
                      onChange={handleDietPlanChange}
                    />
                  </li>
                </ul>
                <Button onClick={handleNextStep}>Next</Button>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>Select your plan size</Accordion.Header>
              <Accordion.Body>
                <div className="frequency-container">
                  <h5>Number of people</h5>

                  <Button
                    className={`people-button ${
                      selectedPeople === "2" ? "active" : ""
                    }`}
                    onClick={handleNumberOfPeople}
                    data-value={"2"}
                  >
                    2
                  </Button>
                  <Button
                    className={`people-button ${
                      selectedPeople === "4" ? "active" : ""
                    }`}
                    onClick={handleNumberOfPeople}
                    data-value={"4"}
                  >
                    4
                  </Button>

                  <h5>Meals per week</h5>
                  <Button
                    className={`frequency-button ${
                      selectedFrequency === "2" ? "active" : ""
                    }`}
                    onClick={handleFrequencyChange}
                    data-value={"2"}
                  >
                    2
                  </Button>
                  <Button
                    className={`frequency-button ${
                      selectedFrequency === "3" ? "active" : ""
                    }`}
                    onClick={handleFrequencyChange}
                    data-value={"3"}
                  >
                    3
                  </Button>
                  <Button
                    className={`frequency-button ${
                      selectedFrequency === "4" ? "active" : ""
                    }`}
                    onClick={handleFrequencyChange}
                    data-value={"4"}
                  >
                    4
                  </Button>
                  <Button
                    className={`frequency-button ${
                      selectedFrequency === "5" ? "active" : ""
                    }`}
                    onClick={handleFrequencyChange}
                    data-value={"5"}
                  >
                    5
                  </Button>
                  <Button
                    className={`frequency-button ${
                      selectedFrequency === "6" ? "active" : ""
                    }`}
                    onClick={handleFrequencyChange}
                    data-value={"6"}
                  >
                    6
                  </Button>
                </div>
                <div className="order-summary">
                  <h3>Order Summary</h3>
                  <p>Number of People: {selectedPeople}</p>
                  <p>Frequency: {selectedFrequency} meals per week</p>
                  <p>Total Meals: {totalMeals}</p>
                  <p>Price per Meal: $</p>{renderPricePerMeal()}
                  <p>Total Price: ${totalPrice}</p>
                  <p>Total After Taxes: ${totalPriceWithTax}</p>
                </div>
                <Button
                  onClick={handleNextStep}
                  style={{ width: "60px", alignSelf: "center" }}
                  className="my-3"
                >
                  Next
                </Button>
              </Accordion.Body>
            </Accordion.Item>

            {/* <Accordion.Item eventKey="2">
              <Accordion.Header>Select your meals </Accordion.Header>
              <Accordion.Body>
                <Row
                  fluid="true"
                  className="meal-card-container"
                  style={{ overflowX: "auto" }}
                >
                  <div style={{ overflowX: 'auto'}}>
                  {selectedMeals.map((meal) => (
                    <Card
                      key={meal._id}
                      style={{
                        width: "400px",
                        height: "800px",
                        marginRight: "10px",
                        overflowY: "auto",
                      }}
                      className="py-3 meal-card"
                    >
                      <Card.Img
                        variant="top"
                        src={meal.imageUrl}
                        style={{
                          border: "5px solid orange",
                          borderRadius: "5px",
                        }}
                      ></Card.Img>
                      <Card.Body>
                        <Card.Title>
                          <h1>
                            <strong>{meal.name}</strong>
                          </h1>
                        </Card.Title>
                        <Card.Text>
                          <u>Description</u>: {meal.description}
                          <br />
                          <br />
                          <details>
                            <summary>
                              <strong>Ingredients:</strong>
                            </summary>
                            <br />
                            <ul className="ingredients-list">
                              {meal.ingredients.map((ingredient, index) => (
                                <li key={index}> {ingredient} </li>
                              ))}
                            </ul>
                          </details>
                          <br />
                          <details>
                            <summary>
                              <strong>Preparation Instructions:</strong>
                            </summary>
                            <p>{meal.preparationInstructions}</p>
                          </details>
                          <br />
                          <div
                            className="dietary-container"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              justifyContent: "space-around",
                            }}
                          >
                            <p>
                              <u>Dietary Category</u>:{" "}
                            </p>
                            {meal.dietaryCategories.map(
                              (dietaryCategory, index) => (
                                <p key={index}> {dietaryCategory} </p>
                              )
                            )}
                          </div>
                          <Button className="add-meal">Add</Button>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ))}
                  </div>  

                  {selectedMeals.map((meal) => (
                    <div
                      key={meal._id}
                      sm={6}
                      md={4}
                      lg={3}
                      className="py-5 meal-card"
                    >
                      <img
                        src={meal.imageUrl}
                        alt={meal.name}
                        style={{
                          border: "5px solid orange",
                          borderRadius: "5px",
                        }}
                      />
                      <h2 className="py-3">{meal.name}</h2>
                      <p>Description: {meal.description}</p>
                      <details>
                        <summary>Show Ingredients</summary>
                        <ul className="ingredients-list">
                          {meal.ingredients.map((ingredient, index) => (
                            <li key={index}> {ingredient} </li>
                          ))}
                        </ul>
                      </details>
                      <br />
                      <p>
                        Preparation Instructions: <br />{" "}
                        {meal.preparationInstructions}
                      </p>
                      <p>Dietary Category: </p>
                      {meal.dietaryCategories.map((dietaryCategory, index) => (
                        <p key={index}> {dietaryCategory} </p>
                      ))}
                      <Button className="add-meal">Add</Button>
                    </div>
                  ))}
                </Row>
                <Button onClick={handleNextStep}>Next</Button>
              </Accordion.Body>
            </Accordion.Item> */}
          </Accordion>
        </Container>
      </>
    )

}


export default Services