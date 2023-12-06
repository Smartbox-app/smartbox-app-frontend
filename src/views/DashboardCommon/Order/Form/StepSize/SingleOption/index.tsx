import React, { ChangeEvent } from 'react';

import './SingleOption.scss';
import {  useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';
import { Spinner } from '../../../../../../components/Branded';
import styled, { css } from 'styled-components';
import { BoxGroupUserRes } from 'smartbox-types';
import ApiService from '../../../../../../services/api-service';
import { PriceInfo } from '../PriceInfo';
import { setBoxGroup, setMinRentPeriod } from '../../../../../../actions/order';

export type SingleOptionType = {
  name: string;
  value: string;
  id: string;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  imgAddress?: string;
};

interface Props {
  singleOptionData: BoxGroupUserRes;
  disable?: boolean;
}

const StyledSingleOptionWrapper = styled.div<{ available: boolean }>`
input[type='radio']:checked + .single-option {
  .radio-img {
    border: 2px solid ${props => props.theme.colors.primary}
  }
}

${props => !props.available && css`
opacity: 0.3;
cursor: not-allowed;
`}
`

const StyledImageDescription = styled.p`
    color: ${props => props.theme.colors.primary};
    font-weight: 700;
    padding: 10px;
}
`

const StyledSizeContainer = styled.div`
background-color: ${props => props.theme.colors.primary};
color: #fff;
text-align: center;
padding: 10px;
`

const StyledAreaVolumeContainer = styled.div`
background-color: rtransparent;
color: ${props => props.theme.colors.primary};
text-align: center;
padding: 10px;
`

const SingleOption = ({ singleOptionData, disable }: Props) => {
  const dispatch = useDispatch();
  const loading = useSelector((state: ApplicationState) => state.spinner.loading);
  const boxGroupId = useSelector((state: ApplicationState) => state.order.boxGroupId);

  const selectOption = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setBoxGroup(singleOptionData.id));
    dispatch(setMinRentPeriod(singleOptionData.minRentPeriod));
  }

  if (loading) return <Spinner />;
  return (
    <StyledSingleOptionWrapper available={singleOptionData.available} className="single-option-wrapper">
      <input
        name={singleOptionData.name}
        type="radio"
        value={singleOptionData.id}
        id={singleOptionData.id}
        checked={singleOptionData.id === boxGroupId}
        onChange={selectOption}
        disabled={!singleOptionData.available}
      />
      <label htmlFor={singleOptionData.id} className={`single-option ${disable ? 'single-option-disable' : ''}`}>
        <div className="radio-img">

          <span className={`img-value ${disable ? 'img-value-disabled' : ''}`}>{disable ? 'BRAK' : ''}</span>
          {singleOptionData.image && (
            <div className="svg-wrapper">
              <img src={`${ApiService.url}box-group-new/image/${singleOptionData.id}`} alt={singleOptionData.name} />
            </div>
          )}
          <StyledImageDescription className="img-description">
            {singleOptionData.name}
          </StyledImageDescription>
          {singleOptionData.height && singleOptionData.width && singleOptionData.depth && <StyledSizeContainer>
            sz. <strong>{singleOptionData.width}m</strong> x gł. <strong>{singleOptionData.depth}m</strong> x  wys. <strong>{singleOptionData.height}m</strong>
          </StyledSizeContainer>}
          {(singleOptionData.volume || singleOptionData.area) && <StyledAreaVolumeContainer>
            {singleOptionData.area && <p>Powierzchnia: <strong>{singleOptionData.area}m²</strong></p>}
            {singleOptionData.volume && <p>Objętość: <strong>{singleOptionData.volume}m³</strong></p>}
          </StyledAreaVolumeContainer>}
          <PriceInfo box={singleOptionData} />
        </div>
      </label>
    </StyledSingleOptionWrapper>
  );
};

export default SingleOption;
