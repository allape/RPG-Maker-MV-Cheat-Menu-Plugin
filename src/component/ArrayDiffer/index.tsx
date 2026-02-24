import { useProxy } from "@allape/use-loading";
import cls from "classnames";
import { ReactElement, useCallback, useEffect, useState } from "react";
import Empty from "../Empty";
import styles from "./style.module.scss";

// noinspection ES6ConvertVarToLetConst,JSDuplicatedDeclaration,JSUnresolvedReference
const DefaultScript: string = `
var list = [];

const maxLengthOfVariable = Math.max($gameVariables._data.length, $dataSystem.variables.length);
const maxLengthOfSwitches = Math.max($gameSwitches._data.length, $dataSystem.switches.length);

list.push("Variable Value");

for(var i = 0; i < maxLengthOfVariable; i++) {
  list.push(String($gameVariables._data[i]) || "---");
}

list.push("Switch Value");

for(var i = 0; i < maxLengthOfSwitches; i++) {
  list.push(String($gameSwitches._data[i]) || "---");
}

return list;
`;

// noinspection ES6ConvertVarToLetConst,JSDuplicatedDeclaration,JSUnresolvedReference
const DefaultAlongWithScript: string = `
var list = [];

const maxLengthOfVariable = Math.max($gameVariables._data.length, $dataSystem.variables.length);
const maxLengthOfSwitches = Math.max($gameSwitches._data.length, $dataSystem.switches.length);

list.push("Variable Name");

for(var i = 0; i < maxLengthOfVariable; i++) {
  list.push(("v"+i+": "+String($dataSystem.variables[i])) || "---");
}

list.push("Switch Name");

for(var i = 0; i < maxLengthOfSwitches; i++) {
  list.push(("s"+i+": "+String($dataSystem.switches[i])) || "---");
}

return list;
`;

function runAndReturn(script: string): unknown {
  try {
    return new Function(script.trim())();
  } catch {
    return null;
  }
}

export interface IArrayDifferProps {
  scriptResultInArray?: string;
  scriptAlongWith?: string;
}

export default function ArrayDiffer({
  scriptResultInArray = DefaultScript,
  scriptAlongWith = DefaultAlongWithScript,
}: IArrayDifferProps): ReactElement {
  const [script, scriptRef, setScript] = useProxy<string | undefined>(
    undefined,
  );
  const [alongWith, alongWithRef, setAlongWith] = useProxy<string | undefined>(
    undefined,
  );

  const [lastData, lastDataRef, setLastData] = useProxy<string[]>([]);
  const [currentData, currentDataRef, setCurrentData] = useProxy<string[]>([]);
  const [sideData, , setSideData] = useProxy<string[]>([]);

  const [diffedIndexes, setDiffedIndexes] = useState<number[]>([]);
  const [focused, setFocused] = useState<number>(-1);

  const handleAlongWithChange = useCallback(() => {
    if (!alongWithRef.current) {
      setSideData([]);
      return;
    }

    const data = runAndReturn(alongWithRef.current);
    if (data instanceof Array) {
      setSideData(data);
    }
  }, [alongWithRef, setSideData]);

  useEffect(() => {
    setAlongWith(scriptAlongWith);
    handleAlongWithChange();
  }, [handleAlongWithChange, scriptAlongWith, setAlongWith]);

  const handleScan = useCallback(() => {
    if (!scriptRef.current) return;

    handleAlongWithChange();

    const value = runAndReturn(scriptRef.current);
    if (!(value instanceof Array)) {
      return;
    }

    setLastData(currentDataRef.current);
    setCurrentData(value);

    if (lastDataRef.current.length === 0) {
      setLastData(value);
      return;
    }

    const indexes: number[] = [];

    value.forEach((v, index) => {
      if (lastDataRef.current[index] !== v) {
        indexes.push(index);
      }
    });

    if (indexes.length > 0) {
      setDiffedIndexes(indexes);
    }
  }, [
    currentDataRef,
    handleAlongWithChange,
    lastDataRef,
    scriptRef,
    setCurrentData,
    setLastData,
  ]);

  const handleReset = useCallback(() => {
    setDiffedIndexes([]);
    setFocused(-1);
  }, []);

  useEffect(() => {
    setScript(scriptResultInArray || undefined);
    handleScan();
  }, [handleScan, scriptResultInArray, setScript]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.differWrapper}>
        <div className={styles.alongWithWrapper}>
          <textarea
            placeholder="Javascript"
            value={alongWith}
            onChange={(e) => setAlongWith(e.target.value)}
            onBlur={handleAlongWithChange}
          ></textarea>

          <div className={styles.list}>
            {diffedIndexes.map((index) => (
              <div
                key={index}
                className={cls(styles.row, index === focused && styles.focused)}
                onClick={() => setFocused(index)}
                title={sideData[index]}
              >
                {sideData[index]}
              </div>
            ))}

            {diffedIndexes.length === 0 && sideData.length !== 0 ? (
              <>
                {sideData.map((v, index) => (
                  <div
                    key={index}
                    className={cls(
                      styles.row,
                      index === focused && styles.focused,
                    )}
                    onClick={() => setFocused(index)}
                    title={v}
                  >
                    {v}
                  </div>
                ))}
              </>
            ) : undefined}

            {diffedIndexes.length === 0 && sideData.length === 0 ? (
              <Empty />
            ) : undefined}
          </div>
        </div>

        <div className={styles.resultWrapper}>
          <textarea
            placeholder="Javascript"
            value={script}
            onChange={(e) => setScript(e.target.value)}
          ></textarea>
          <div className={styles.differ}>
            <div className={styles.list}>
              {diffedIndexes.map((index) => (
                <div
                  key={index}
                  className={cls(
                    styles.row,
                    index === focused && styles.focused,
                  )}
                  onClick={() => setFocused(index)}
                  title={lastData[index]}
                >
                  {lastData[index]}
                </div>
              ))}

              {diffedIndexes.length === 0 && lastData.length !== 0 ? (
                <>
                  {lastData.map((v, index) => (
                    <div
                      key={index}
                      className={cls(
                        styles.row,
                        index === focused && styles.focused,
                      )}
                      onClick={() => setFocused(index)}
                      title={v}
                    >
                      {v}
                    </div>
                  ))}
                </>
              ) : undefined}

              {diffedIndexes.length === 0 && lastData.length === 0 ? (
                <Empty />
              ) : undefined}
            </div>

            <div className={styles.list}>
              {diffedIndexes.map((index) => (
                <div
                  key={index}
                  className={cls(
                    styles.row,
                    index === focused && styles.focused,
                  )}
                  onClick={() => setFocused(index)}
                  title={currentData[index]}
                >
                  {currentData[index]}
                </div>
              ))}
              {diffedIndexes.length === 0 ? <Empty /> : undefined}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <button className={styles.reset} onClick={handleReset}>
          Reset
        </button>
        <button onClick={handleScan}>Scan</button>
      </div>
    </div>
  );
}
