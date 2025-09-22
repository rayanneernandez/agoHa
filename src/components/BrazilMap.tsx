import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { mockLeads, getRegionByUF } from '../data/mockData';
import 'leaflet/dist/leaflet.css';

interface BrazilMapProps {
  onRegionSelect?: (region: string) => void;
}

interface RegionData {
  name: string;
  color: string;
  total: number;
  ativos: number;
}

export const BrazilMap: React.FC<BrazilMapProps> = ({ onRegionSelect }) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [regionsData, setRegionsData] = useState<{ [key: string]: RegionData }>({});
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    // Calcular estatísticas por região
    const regions = {
      'Norte': { name: 'Norte', color: '#3B82F6', total: 0, ativos: 0 },
      'Nordeste': { name: 'Nordeste', color: '#10B981', total: 0, ativos: 0 },
      'Centro-Oeste': { name: 'Centro-Oeste', color: '#F59E0B', total: 0, ativos: 0 },
      'Sudeste': { name: 'Sudeste', color: '#EF4444', total: 0, ativos: 0 },
      'Sul': { name: 'Sul', color: '#8B5CF6', total: 0, ativos: 0 }
    };

    mockLeads.forEach(lead => {
      const region = getRegionByUF(lead.uf);
      if (regions[region]) {
        regions[region].total++;
        if (lead.ativo) regions[region].ativos++;
      }
    });

    setRegionsData(regions);

    // Carregar o GeoJSON das regiões do Brasil
    fetch('https://servicodados.ibge.gov.br/api/v3/malhas/BR?formato=application/vnd.geo+json&qualidade=minima&intrarregiao=regiao')
      .then(response => response.json())
      .then(data => {
        // Adicionar propriedades necessárias ao GeoJSON
        const enhancedData = {
          ...data,
          features: data.features.map((feature: any) => ({
            ...feature,
            properties: {
              ...feature.properties,
              name: feature.properties.nome || ''
            }
          }))
        };
        setGeoJsonData(enhancedData);
      });
  }, []);

  const handleRegionClick = (region: string) => {
    setSelectedRegion(region);
    onRegionSelect?.(region);
  };

  const getRegionStyle = (feature: any) => {
    const regionName = feature.properties.name;
    const region = regionsData[regionName];
    const isSelected = selectedRegion === regionName;

    return {
      fillColor: region?.color || '#cccccc',
      weight: isSelected ? 3 : 2,
      opacity: 1,
      color: isSelected ? '#000' : '#fff',
      fillOpacity: isSelected ? 0.8 : 0.6
    };
  };

  const onEachRegion = (feature: any, layer: any) => {
    const regionName = feature.properties.name;
    const region = regionsData[regionName];
    
    if (region) {
      layer.on({
        click: () => handleRegionClick(regionName),
        mouseover: (e: any) => {
          const layer = e.target;
          layer.setStyle({
            weight: 3,
            color: '#666',
            fillOpacity: 0.8
          });
        },
        mouseout: (e: any) => {
          const layer = e.target;
          layer.setStyle(getRegionStyle(feature));
        }
      });

      layer.bindTooltip(`
        <strong>${regionName}</strong><br/>
        Total: ${region.total}<br/>
        Ativos: ${region.ativos}
      `, { permanent: false, direction: 'center' });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Mapa do Brasil - Leads por Região</h3>
      
      <div className="h-96 rounded-lg overflow-hidden mb-4">
        <MapContainer
          center={[-14.2350, -51.9253]}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {geoJsonData && (
            <GeoJSON
              data={geoJsonData}
              style={getRegionStyle}
              onEachFeature={onEachRegion}
            />
          )}
        </MapContainer>
      </div>

      {/* Legenda das regiões */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.values(regionsData).map((region) => (
          <div
            key={region.name}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedRegion === region.name 
                ? 'border-current bg-gray-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            style={{ borderColor: selectedRegion === region.name ? region.color : undefined }}
            onClick={() => handleRegionClick(region.name)}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: region.color }}
              ></div>
              <span className="text-sm font-medium text-gray-900">{region.name}</span>
            </div>
            <div className="text-xs text-gray-600">
              <div>Total: {region.total}</div>
              <div>Ativos: {region.ativos}</div>
            </div>
          </div>
        ))}
      </div>

      {selectedRegion && regionsData[selectedRegion] && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Região {selectedRegion} Selecionada</h4>
          <p className="text-sm text-blue-700">
            {`${regionsData[selectedRegion].total} leads no total, sendo ${regionsData[selectedRegion].ativos} ativos e ${regionsData[selectedRegion].total - regionsData[selectedRegion].ativos} inativos.`}
          </p>
        </div>
      )}
    </div>
  );
};