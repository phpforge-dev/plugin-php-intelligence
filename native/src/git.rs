use serde_json::Value;use crate::workspace::Res;
pub fn s(v:&Value)->Res<&str>{v.as_str().ok_or_else(||"Campo de texto inválido".into())}
