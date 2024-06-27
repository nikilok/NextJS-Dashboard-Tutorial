'use client';

declare global {
  interface Window {
    am5: any;
    am5map: any;
    am5geodata_worldLow: any;
    am5themes_Animated: any;
  }
}

const am5 = window.am5;
const am5map = window.am5map;
const am5geodata_worldLow = window.am5geodata_worldLow;
const am5themes_Animated = window.am5themes_Animated;
import { useEffect } from 'react';

export default function Maps() {
  useEffect(() => {
    // Data
    const groupData = [
      {
        name: 'AAA',
        data: [
          { id: 'AT', rating: '1995' },
          { id: 'IE', rating: '1973' },
          { id: 'DK', rating: '1973' },
          { id: 'FI', rating: '1995' },
          { id: 'SE', rating: '1995' },
          { id: 'GB', rating: '1973' },
          { id: 'IT', rating: '1957' },
          { id: 'FR', rating: '1957' },
          { id: 'ES', rating: '1986' },
          { id: 'GR', rating: '1981' },
          { id: 'DE', rating: '1957' },
          { id: 'BE', rating: '1957' },
          { id: 'LU', rating: '1957' },
          { id: 'NL', rating: '1957' },
          { id: 'PT', rating: '1986' },
        ],
      },
      {
        name: 'AA',
        data: [
          { id: 'LT', rating: '2004' },
          { id: 'LV', rating: '2004' },
          { id: 'CZ', rating: '2004' },
          { id: 'SK', rating: '2004' },
          { id: 'SI', rating: '2004' },
          { id: 'EE', rating: '2004' },
          { id: 'HU', rating: '2004' },
          { id: 'CY', rating: '2004' },
          { id: 'MT', rating: '2004' },
          { id: 'PL', rating: '2004' },
        ],
      },
      {
        name: 'A',
        data: [
          { id: 'RO', rating: '2007' },
          { id: 'BG', rating: '2007' },
        ],
      },
      {
        name: 'BBB',
        data: [{ id: 'HR', rating: '2013' }],
      },
    ];

    // Create root and chart
    const root = am5.Root.new('chartdiv');

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        homeZoomLevel: 0.2,
        homeGeoPoint: { longitude: 0, latitude: 0 },
      }),
    );

    // Create world polygon series
    const worldSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow as any,
        exclude: ['AQ'],
      }),
    );

    worldSeries.mapPolygons.template.setAll({
      fill: am5.color(0xaaaaaa),
    });

    worldSeries.events.on('datavalidated', () => {
      chart.goHome();
    });

    // Add legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        useDefaultMarker: true,
        centerX: am5.p50,
        x: am5.p50,
        centerY: am5.p100,
        y: am5.p100,
        dy: -20,
        background: am5.RoundedRectangle.new(root, {
          fill: am5.color(0xffffff),
          fillOpacity: 0.2,
        }),
      }),
    );

    legend.valueLabels.template.set('forceHidden', true);

    // Create series for each group
    const colors = am5.ColorSet.new(root, {
      step: 2,
    });
    colors.next();

    am5.array.each(groupData, function (group) {
      const countries: string[] = [];
      const color = colors.next();

      am5.array.each(group.data, function (country) {
        countries.push(country.id);
      });

      const polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow as any,
          include: countries,
          name: group.name,
          fill: color,
        }),
      );

      polygonSeries.mapPolygons.template.setAll({
        tooltipText: '[bold]{name}[/]\nRating at {rating}',
        interactive: true,
        fill: color,
        strokeWidth: 2,
      });

      polygonSeries.mapPolygons.template.states.create('hover', {
        fill: am5.Color.brighten(color, -0.3),
      });

      polygonSeries.mapPolygons.template.events.on(
        'pointerover',
        function (ev) {
          ev?.target?.series?.mapPolygons.each(function (polygon) {
            polygon.states.applyAnimate('hover');
          });
        },
      );

      polygonSeries.mapPolygons.template.events.on('pointerout', function (ev) {
        ev?.target?.series?.mapPolygons.each(function (polygon) {
          polygon.states.applyAnimate('default');
        });
      });
      polygonSeries.data.setAll(group.data);

      legend.data.push(polygonSeries);
    });
    return () => root.dispose();
  }, []);

  return (
    <div id="chartdiv" style={{ width: 'auto', height: 'calc(90%)' }}></div>
  );
}
