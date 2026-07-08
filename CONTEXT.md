# grants-config-land-grants

Configuration for land grant journeys, action selection, and payment-related grant rules.

## Language

**Land grants**
The grant family represented by `configurations/land-grants`.
_Avoid_: Grasslands, Woodland, Generic grant when this configuration is meant

**Action**
A coded land management option such as `CLIG3`, `CMOR1`, `CSAM3`, `PA3`, `UPL1`, `UPL2`, `UPL3`, `UPL8`, or `UPL10`.
_Avoid_: Product, Item, Checkbox option

**Action code**
The stable identifier for a configured action.
_Avoid_: Slug, Display name, Payment code

**Land parcel**
A registered area of land associated with an SBI and selected for actions.
_Avoid_: Field, Plot, Property

**Payment**
The grant amount calculated from selected parcels, actions, and payment rules.
_Avoid_: Fee, Invoice, Charge

**Grant journey**
The end-to-end user flow rendered from the land grants configuration.
_Avoid_: Wizard, Survey, Funnel

**Grant configuration**
A versioned set of files that describes journeys, action definitions, and integration metadata.
_Avoid_: Source code, Runtime state, Test script

**Changeset**
The release note/version marker required for configuration changes.
_Avoid_: Changelog entry when the `.changeset` file is meant, Commit message

**Hotfix release**
A patch release from a tagged version used only when the normal release path cannot deliver the fix.
_Avoid_: Regular release, Feature branch, Rollback
