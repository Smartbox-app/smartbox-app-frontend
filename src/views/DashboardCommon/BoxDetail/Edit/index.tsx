import { connect } from "react-redux";
import { RentStatus, UserRes } from "smartbox-types";
import { ApplicationState } from "../../../../reducers";
import { isAdminOrTenant } from "../../../../utils/role-check";

import Position from "./Position";
import Status from "./Status";
import "./Edit.scss";
import { Alert } from "../../../../components/Common";
import { useGetMyDetailsQuery } from "../../../../queries";

interface Props {
  selectedBoxId: string;
  rentId: string;
  singleBoxDetailStatus: RentStatus;
  display: boolean;
  stockId: string;
  callback?: () => void;
}

export const Edit = ({
  selectedBoxId,
  rentId,
  singleBoxDetailStatus,
  display,
  stockId,
  callback,
}: Props) => {
  const { data: user } = useGetMyDetailsQuery();
  if (!user) return null;
  return (
    <div className={`edit-wrapper ${display && "show-me"}`}>
      <Alert text="application.changesIrreversible" type="notice" />
      <Status
        callback={callback}
        selectedBoxId={selectedBoxId}
        stockId={stockId}
        rentId={rentId}
      />
      {isAdminOrTenant(user.role) &&
        rentId !== "" &&
        singleBoxDetailStatus === RentStatus.rented && (
          <Position callback={callback} rentId={rentId} stockId={stockId} />
        )}
    </div>
  );
};
