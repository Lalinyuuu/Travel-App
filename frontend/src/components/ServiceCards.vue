<template>
  <section class="py-16 bg-(--color-background) transition-colors duration-300">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 container">
      <div
        v-for="(service, index) in services"
        :key="index"
        class="bg-(--color-card-bg) rounded-3xl p-8 text-center shadow-lg transition-all duration-300 flex flex-col items-center border border-(--color-border) dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] hover:-translate-y-2 hover:shadow-xl hover:border-[rgba(255,130,169,0.4)]"
      >
        <div
          class="w-20 h-20 rounded-full flex items-center justify-center mb-6 text-white transition-colors duration-300"
          :class="getIconClass(index)"
        >
          <component :is="service.icon" />
        </div>
        <h3
          class="text-xl font-bold text-(--color-service-text) m-0 mb-3 transition-colors duration-300"
        >
          {{ service.title }}
        </h3>
        <p
          class="text-[0.95rem] text-(--color-service-text) leading-relaxed m-0 transition-colors duration-300"
        >
          {{ service.description }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { h, computed } from "vue";
import { useI18n } from "vue-i18n";

const { tm } = useI18n();

const getIconClass = (index) => {
  const classes = [
    "bg-[#BC8F8F] dark:bg-[#9DD8D4]",
    "bg-[#C6D9BB] dark:bg-[#6BA08A]",
    "bg-[#FFD3B6] dark:bg-[#A9B5E3]",
    "bg-[#D4EEF1] dark:bg-[#CC9B71]",
  ];
  return classes[index] || "bg-[#BC8F8F] dark:bg-[#9DD8D4]";
};

const ShareExperienceIcon = () =>
  h(
    "svg",
    {
      width: "32",
      height: "32",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    },
    [
      h("path", {
        d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
      }),
      h("path", {
        d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
      }),
    ]
  );

const SearchIcon = () =>
  h(
    "svg",
    {
      width: "32",
      height: "32",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
    },
    [
      h("circle", { cx: "11", cy: "11", r: "8" }),
      h("path", { d: "m21 21-4.35-4.35" }),
    ]
  );

const GuideIcon = () =>
  h(
    "svg",
    {
      width: "32",
      height: "32",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
    },
    [
      h("path", {
        d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",
      }),
      h("path", { d: "M9 10h6" }),
      h("path", { d: "M9 14h6" }),
    ]
  );

const InfoIcon = () =>
  h(
    "svg",
    {
      width: "32",
      height: "32",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
    },
    [
      h("circle", { cx: "12", cy: "12", r: "10" }),
      h("path", { d: "M12 16v-4" }),
      h("path", { d: "M12 8h.01" }),
    ]
  );

const serviceIcons = [ShareExperienceIcon, SearchIcon, GuideIcon, InfoIcon];

const services = computed(() => {
  const serviceCards = tm("services.cards");
  if (!Array.isArray(serviceCards)) {
    return [];
  }
  return serviceCards.map((card, index) => ({
    title: card.title,
    description: card.description,
    icon: serviceIcons[index],
  }));
});
</script>
