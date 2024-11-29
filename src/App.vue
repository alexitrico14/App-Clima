<template>
  <div id="app">
    <header>
      <h1>Clima Actual</h1>
    </header>
    <main>
      <Weather />
      <Location />
    </main>
  </div>
</template>

<script>
import Weather from "./components/Weather.vue";
import Location from "./components/Location.vue";

export default {
  components: {
    Weather,
    Location,
  },
};
</script>

<style>
body * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

#result {
  width: 500px;
  margin: 20px;
  border: solid 1px black;
  padding: 10px;
}

#result img {
  width: 100px;
}

#weather-icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

#weather-icon__title {
  font-size: 2em;
  text-align: right;
}

#weather-icon__title span {
  font-size: 0.5em;
  font-weight: bold;
  text-align: left;
  margin: 0;
}

#weather-details {
  border-top: 1px solid black;
}

#location-details {
  margin-top: 20px;
}
</style>
