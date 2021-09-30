<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import PieChart from "../components/charts/PieChart.svelte";
</script>

<Meta
  title="Example/PieChart"
  component={PieChart}
  argTypes={{
  }}
/>

<Template let:args>
  <div style="width: 700px; height: 300px">
    <PieChart
      data={{
        labels: ["stuff", "thing", "other"],
        datasets: [
          {
          name: "thing",
          values: [5, 2, 5],
          },
          {
          name: "other",
          values: [3, 2, 1],
          }
        ],
      }}
      {...args}
    />
  </div>
</Template>

<Story
  name="LoggedIn"
  args={{
    user: {},
  }}
/>

<Story name="LoggedOut" args={{}} />
