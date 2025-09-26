import { Button, Typography } from "@mui/material";// MUI bileşenleri
import React, { use } from "react";
import { useDispatch, useSelector } from "react-redux";// redux store ile etkileşim için hook'lar
import {
    decrement,
    increment,
    incrementByAmount,
} from "./counterSlice";

export default function Counter() {
    const value = useSelector((state) => state.counter.value);// state içinden counter slice'ının value'sunu al
    const dispatch = useDispatch();// action dispatch etmek için kullan
    const [amount, setAmount] = React.useState(0);

    return (
      <div>
        <Typography variant="h3" component="h3" align="center" mt={5}>
          {value}
        </Typography>
        {/* sayacı göster */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(increment())}
        >
          Increment
        </Button>
        {/* Artırma butonu */}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => dispatch(decrement())}
          style={{ marginLeft: "10px" }}
        >
          Decrement
        </Button>
        {/* Kullanıcının girdiği miktar */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{ marginLeft: "10px", width: "80px" }}
        />
        <Button
          variant="contained"
          onClick={() => dispatch(incrementByAmount(Number(amount)))}
          style={{ marginLeft: "10px" }}
        >
          Increment by {amount}
        </Button>
      </div>
    );
}
