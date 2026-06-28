const url = "http://localhost:30001/tasks";

export async function getAllCards() {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function getCard(id){
    try {
    const res = await fetch(`${url}/${id}`);
    if (!res.ok) throw new Error(`error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }

}
export async function addCard(card) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(card),
    });
    if (!res.ok) throw new Error(`error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function deleteCard(id) {
  try {
    const res = await fetch(`${url}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`error ${res.status}`);
  } catch (err) {
    console.log(err);
  }
}
export async function updateCards(id, card) {
  try {
    const res = await fetch(`${url}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(card),
    });
    
    if (!res.ok) throw new Error(`error ${res.status}`);
    const data = await res.json();
    return data
  } catch (err) {
    console.log(err)
  }
}
