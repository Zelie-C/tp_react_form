import React, { useCallback, useEffect, useState } from "react"
import { useDebounce } from 'usehooks-ts'

const AdressForm = () => {

  const [saisie, setSaisie] = useState<string>("")
  const adressRequest = useDebounce(saisie, 300)
  const [resultRequest, setResultRequest] = useState([])

  useEffect(
    () => {
      const request = async () => {
        if (adressRequest.length > 3) {
          const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${adressRequest}`)
          const message = await response.json();
          console.log(message)
          const locArray = message.features.map(
            (feature: any) => feature.properties.label
          )
          if (locArray.length >= 1) {
            setResultRequest(locArray);
          }
        }
      }
      request()
  }, [adressRequest])

  const handleChangeEvent = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSaisie(e.target.value);
      console.log(saisie);
    }, []
  )

  const handleListClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    setSaisie(resultRequest[i])
  }, [resultRequest])

  const handleButtonClick = () => {
    console.log(saisie)
  }

  return (
    <>
    <div>
      <div className="input-button-component">
        <input type="text" onChange={handleChangeEvent} value={saisie} />
        <button onClick={handleButtonClick}>Envoyer</button>
      </div>
      <div>
      {resultRequest.length > 0 && <div>
        {resultRequest.map(
          (loc, i) => (<div key={i} className='adress-list' style={{display: adressRequest.length === 0 ? 'none' : 'block'}} onClick={(e) => {handleListClick(e, i)}}>{loc}</div>
          ))}
        </div>
      }
      </div>
    </div>
    </>
  )
}

export default AdressForm;
