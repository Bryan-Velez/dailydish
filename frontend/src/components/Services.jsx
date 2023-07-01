import { Button, Container, Accordion, Col } from "react-bootstrap"
import axios from 'axios'
import { useEffect, useState } from "react"
import step1 from '../assets/number-icons/1.svg'
import step2 from '../assets/number-icons/2.svg'
import step3 from '../assets/number-icons/3.svg'
import step4 from '../assets/number-icons/4.svg'
import step5 from '../assets/number-icons/5.svg'



function Services() {

    const URL = `http://localhost:3001/api`
    const [meals, setMeals] = useState([])

    useEffect(() => {
        const getMeals = async() => {
            const mealAPI = await axios.get(`${URL}/meals`)
            console.log(mealAPI.data)
            setMeals(mealAPI.data)
        }
        getMeals()
    }, [])
//////////for styling number icons
    const steps = typeof document !== "undefined" && document.querySelectorAll('.number')
    const highlightStep = (id) => {
        for ( i = 0; i < steps.length; i++) {
        if (i === id) {
            steps[i].classList.add('clicked')
        }  
        }
    }


    // .number.clicked {
    //     filter: invert(100%) sepia(0%) saturate(1%) hue-rotate(149deg) brightness(106%) contrast(101%);
      
    //   }
///////////////////
    return (
      <>
        <div className="home-page">
          <div className="home text-dark">
            <h1 style={{ fontSize: `8vw` }}>DailyDish</h1>
            <p className="mx-2" style={{ fontSize: `2vw` }}>
              Dine Different.
            </p>
            <Button className="mx-2">Get Started</Button>
          </div>
        </div>

        <div className="py-5 my-5 step-container">
          <img src= {step1} className="number" alt="1" />
          <img src= {step2} className="number" alt="2" />
          <img src= {step3} className="number" alt="3" />
          <img src= {step4} className="number" alt="4" />
          <img src= {step5} className="number" alt="5" />
        </div>

        <Container className="services-main">
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Choose your diet plan</Accordion.Header>
              <Accordion.Body>
                <ul class="checklist">
                  <li class="checklist-item">
                    <span>All</span>
                    <input type="checkbox" />
                  </li>
                  <li class="checklist-item">
                    <span>Vegeterian</span>
                    <input type="checkbox" />
                  </li>
                  <li class="checklist-item">
                    <span>Pescatarian</span>
                    <input type="checkbox" />
                  </li>
                  <li class="checklist-item">
                    <span>Vegan</span>
                    <input type="checkbox" />
                  </li>
                  <li class="checklist-item">
                    <span>Halal</span>
                    <input type="checkbox" />
                  </li>
                  <li class="checklist-item">
                    <span>Kosher</span>
                    <input type="checkbox" />
                  </li>
                  <li class="checklist-item">
                    <span>Gluten-Free</span>
                    <input type="checkbox" />
                  </li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>Select you Meals </Accordion.Header>
              <Accordion.Body>

              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>Select your frequency</Accordion.Header>
              <Accordion.Body></Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>Login</Accordion.Header>
              <Accordion.Body></Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>Payment</Accordion.Header>
              <Accordion.Body></Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Container>
      </>
    );

}

export default Services